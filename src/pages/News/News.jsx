import { useState, useEffect, useMemo } from "react";
import NewsCard from "../../Components/NewsCard/NewsCard.jsx";
import db, { auth } from "../../FirebaseConfig/FirebaseConfig.js";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";
import EditNewsModal from "../EditNewsModal/EditNewsModal.jsx";
import useCategoriesCollection from "../../hooks/getCategorias.js";
import "./News.css";

const News = ({ role }) => {
  const [news, setNews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uid, setUid] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [catFilter, setCatFilter] = useState("Todas");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const { categories: CATEGORIES } = useCategoriesCollection(["Todas"]);

  const editorTransitions = (current) => {
    const s = current || "Edición";
    if (s === "Edición") return [s];
    if (s === "Terminado") return [s, "Publicado", "Desactivado"];
    if (s === "Publicado") return [s, "Desactivado"];
    if (s === "Desactivado") return [s, "Publicado"];
    return [s];
  };

  const loadNews = async (currentUid, currentRole) => {
    try {
      const colRef = collection(db, "Noticias");
      const snap =
        currentRole === "Editor"
          ? await getDocs(colRef)
          : await getDocs(query(colRef, where("authorId", "==", currentUid)));
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setNews(items);
    } catch (err) {
      console.error("Error cargando noticias:", err);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      const id = u?.uid || null;
      setUid(id);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!uid) {
      setNews([]);
      return;
    }
    loadNews(uid, role);
  }, [uid, role]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return news.filter((n) => {
      const byTerm =
        !term ||
        [n.titulo, n.subtitulo, n.contenido, n.noticia]
          .map((v) => (v || "").toLowerCase())
          .some((t) => t.includes(term));
      const byStatus =
        statusFilter === "Todos" || (n.estado || "Edición") === statusFilter;
      const byCat =
        catFilter === "Todas" ||
        (n.categoria || n.section || "").toString() === catFilter;
      return byTerm && byStatus && byCat;
    });
  }, [news, search, statusFilter, catFilter]);

  const total = news.length;
  const totalPublicadas = news.filter(
    (n) => (n.estado || "Edición") === "Publicado"
  ).length;
  const totalPendientes = news.filter(
    (n) => (n.estado || "Edición") !== "Publicado"
  ).length;
  const totalDesactivadas = news.filter(
    (n) => (n.estado || "Edición") === "Desactivado"
  ).length;

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="news-page">
      <div className="news-top">
        <div className="search">
          <span className="icon" aria-hidden>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </span>
          <input
            className="search-input"
            type="search"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="filters">
          <select
            className="select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            {["Todos", "Edición", "Terminado", "Publicado", "Desactivado"].map(
              (s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              )
            )}
          </select>
          <select
            className="select"
            value={catFilter}
            onChange={(e) => {
              setCatFilter(e.target.value);
              setPage(1);
            }}
          >
            {["Todas", ...CATEGORIES.filter((c) => c && c !== "Todas")].map(
              (c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              )
            )}
          </select>
          {role !== "Editor" && (
            <Link
              className="btn-primary btn-create"
              to="/crear"
              aria-label="Crear nueva noticia"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
              Crear noticia
            </Link>
          )}
        </div>
      </div>

      {role === "Reportero" && (
        <div className="summary" aria-label="Resumen de mis noticias">
          <span className="stat-chip">Total: {total}</span>
          <span className="stat-chip ok">Publicadas: {totalPublicadas}</span>
          <span className="stat-chip warn">Pendientes: {totalPendientes}</span>
          <span className="stat-chip">Desactivadas: {totalDesactivadas}</span>
        </div>
      )}

      <div className="cards">
        {paginated.map((n) => (
          <div className="card-wrap" key={n.id}>
            <NewsCard news={n} />
            <div className="card-actions">
              {role === "Editor" ? (
                (() => {
                  const currentStatus = n.estado ?? "Edición";
                  const allowed = editorTransitions(currentStatus);
                  const disabled = allowed.length <= 1;
                  return (
                    <EditorStatusSelector
                      current={currentStatus}
                      allowed={allowed}
                      disabled={disabled}
                      saving={savingId === n.id}
                      onChange={async (val) => {
                        try {
                          if (disabled) return;
                          setSavingId(n.id);
                          await updateDoc(doc(db, "Noticias", n.id), {
                            estado: val,
                            fechaActualizacion: serverTimestamp(),
                          });
                          setNews((list) =>
                            list.map((it) =>
                              it.id === n.id ? { ...it, estado: val } : it
                            )
                          );
                        } catch (e) {
                          console.error("Error actualizando estado", e);
                        } finally {
                          setSavingId(null);
                        }
                      }}
                    />
                  );
                })()
              ) : n.estado !== "Publicado" ? (
                <button
                  className="edit-btn"
                  title="Editar"
                  aria-label={`Editar ${n.titulo || "noticia"}`}
                  onClick={() => {
                    setEditingId(n.id);
                    setIsModalOpen(true);
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                  Editar
                </button>
              ) : (
                <span className="muted">Publicado</span>
              )}
            </div>
          </div>
        ))}
        {paginated.length === 0 && <div className="empty">Sin resultados</div>}
      </div>

      <div className="pager">
        <button
          className="pager-btn"
          disabled={currentPage <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Anterior
        </button>
        <span className="pager-info">
          Página {currentPage} de {totalPages}
        </span>
        <button
          className="pager-btn"
          disabled={currentPage >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Siguiente
        </button>
      </div>

      <EditNewsModal
        open={isModalOpen}
        newsId={editingId}
        role={role}
        onClose={async (saved) => {
          setIsModalOpen(false);
          setEditingId(null);
          if (saved && uid) await loadNews(uid, role);
        }}
      />
    </div>
  );
};

const EditorStatusSelector = ({
  current,
  allowed,
  saving,
  disabled,
  onChange,
}) => {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      Estado:
      <select
        value={current}
        onChange={(e) => onChange(e.target.value)}
        disabled={saving || disabled}
      >
        {allowed.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {saving && (
        <span style={{ fontSize: 12, color: "#666" }}>Guardando...</span>
      )}
    </label>
  );
};

export default News;
