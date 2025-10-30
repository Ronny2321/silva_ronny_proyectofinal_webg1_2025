import { useState, useEffect } from "react";
import "./News.css";
import NewsCard from "../NewsCard/NewsCard.jsx";
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

const News = ({ role }) => {
  const [news, setNews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uid, setUid] = useState(null);
  const [savingId, setSavingId] = useState(null);

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
  return (
    <main>
      {role !== "Editor" && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 12,
          }}
        >
          <Link to="/crear">
            <button>Crear noticia</button>
          </Link>
        </div>
      )}
      {news.length > 0 ? (
        news.map((n) => (
          <div key={n.id} style={{ marginBottom: 12 }}>
            <NewsCard news={n} />
            <div style={{ marginTop: 6 }}>
              {role === "Editor" ? (
                (() => {
                  const currentStatus = (n.estado || n.status) ?? "Edición";
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
                            status: val,
                            updatedAt: serverTimestamp(),
                          });
                          setNews((list) =>
                            list.map((it) =>
                              it.id === n.id
                                ? { ...it, estado: val, status: val }
                                : it
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
              ) : (n.estado || n.status) !== "Publicado" ? (
                <button
                  onClick={() => {
                    setEditingId(n.id);
                    setIsModalOpen(true);
                  }}
                >
                  Editar
                </button>
              ) : (
                <span style={{ color: "#666", fontSize: 12 }}>
                  Publicado
                </span>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>Cargando noticias...</p>
      )}
      <EditNewsModal
        open={isModalOpen}
        newsId={editingId}
        role={role}
        onClose={async (saved) => {
          setIsModalOpen(false);
          setEditingId(null);
          if (saved && uid) await loadNews(uid);
        }}
      />
    </main>
  );
};

const EditorStatusSelector = ({ current, allowed, saving, disabled, onChange }) => {
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
