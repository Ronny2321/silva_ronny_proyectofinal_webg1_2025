import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import db from "../../FirebaseConfig/FirebaseConfig";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  where,
  query,
  limit,
} from "firebase/firestore";
import "./NewsDetail.css";

export default function NewsDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const ref = doc(db, "Noticias", id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          if (!cancelled) setError("Noticia no encontrada");
          return;
        }
        const data = snap.data();
        const estadoActual = data.estado || data.status;
        if (estadoActual !== "Publicado") {
          if (!cancelled) setError("Noticia no disponible");
          return;
        }
        if (!cancelled) setItem({ id: snap.id, ...data });
      } catch (e) {
        console.error("Error cargando noticia", e);
        if (!cancelled) setError("Error cargando la noticia");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const [more, setMore] = useState([]);
  useEffect(() => {
    let cancelled = false;
    const loadMore = async () => {
      try {
        const ref = collection(db, "Noticias");
        const q = query(ref, where("estado", "==", "Publicado"), limit(6));
        const snap = await getDocs(q);
        if (cancelled) return;
        const arr = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((n) => n.id !== id)
          .slice(0, 5);
        setMore(arr);
      } catch {
        /* ignorar errores del aside */
      }
    };
    loadMore();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading)
    return (
      <div className="detail-shell">
        <div className="loading">Cargando…</div>
      </div>
    );
  if (error)
    return (
      <div className="detail-shell">
        <div className="error">{error}</div>
      </div>
    );
  if (!item) return null;

  const fecha = item.fechaPublicacion || item.fecha || item.fechaCreacion;
  const fechaStr = (() => {
    if (!fecha) return "";
    if (typeof fecha === "string") return fecha;
    if (fecha?.toDate) return fecha.toDate().toLocaleString();
    try {
      return new Date(fecha).toLocaleString();
    } catch {
      return "";
    }
  })();

  const url = typeof window !== "undefined" ? window.location.href : "";
  const share = (kind) => {
    const text = encodeURIComponent(item.titulo || "Noticia");
    const u = encodeURIComponent(url);
    if (kind === "x")
      window.open(
        `https://twitter.com/intent/tweet?text=${text}&url=${u}`,
        "_blank"
      );
    if (kind === "fb")
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${u}`,
        "_blank"
      );
    if (kind === "copy") navigator.clipboard?.writeText(url);
  };

  return (
    <div className="detail-shell container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="detail-grid">
        <article className="article">
          <div className="back-share">
            <Link to="/home" className="back-link" aria-label="Volver">
              Volver
            </Link>
            <div className="share">
              <button
                className="share-btn"
                title="Compartir en X"
                onClick={() => share("x")}
                aria-label="Compartir en X"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M18.9 3H22l-7.7 8.8L23.5 21H17l-5-6.1L6 21H2.9l8.3-9.5L1.5 3H8l4.6 5.6L18.9 3Z" />
                </svg>
              </button>
              <button
                className="share-btn"
                title="Compartir en Facebook"
                onClick={() => share("fb")}
                aria-label="Compartir en Facebook"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M22 12.06C22 6.48 17.52 2 11.94 2S1.88 6.48 1.88 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.42V9.94c0-2.4 1.43-3.73 3.62-3.73 1.05 0 2.16.19 2.16.19v2.37h-1.22c-1.2 0-1.58.75-1.58 1.52v1.82h2.69l-.43 2.9h-2.26V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
                </svg>
              </button>
              <button
                className="share-btn"
                title="Copiar enlace"
                onClick={() => share("copy")}
                aria-label="Copiar enlace"
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
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
            </div>
          </div>

          <h1 className="title text-2xl sm:text-3xl md:text-4xl font-serif">
            {item.titulo}
          </h1>
          {item.subtitulo && (
            <p className="subtitle text-sm sm:text-base md:text-lg">
              {item.subtitulo}
            </p>
          )}
          {fechaStr && (
            <p className="meta">
              Publicado: {fechaStr}
              {item.autor ? ` • ${item.autor}` : ""}
            </p>
          )}

          {item.imagen ? (
            <img
              className="hero w-full h-auto rounded-xl aspect-video object-cover"
              src={item.imagen}
              alt={item.titulo}
            />
          ) : (
            <div
              className="hero placeholder w-full rounded-xl aspect-video"
              aria-hidden
            />
          )}

          {(item.categoria || item.estado) && (
            <div className="cat">
              {item.categoria && (
                <>
                  Sección: <span className="cat-badge">{item.categoria}</span>
                </>
              )}
              {(() => {
                const est = item.estado || item.status;
                const cls =
                  est === "Publicado"
                    ? "status-published"
                    : est === "Terminado"
                    ? "status-done"
                    : est === "Desactivado"
                    ? "status-off"
                    : est === "Edición"
                    ? "status-editing"
                    : "";
                return est ? (
                  <span className={`status-badge ${cls}`}>{est}</span>
                ) : null;
              })()}
            </div>
          )}

          <div className="article-body">{item.contenido}</div>
        </article>

        <aside className="aside">
          <h3 className="aside-title">Más leídas</h3>
          <ul className="aside-list">
            {more.map((n) => (
              <li key={n.id}>
                <Link className="aside-card" to={`/noticia/${n.id}`}>
                  <div className={"aside-thumb" + (n.imagen ? "" : " blank")}>
                    {n.imagen && <img src={n.imagen} alt="" loading="lazy" />}
                  </div>
                  <div className="aside-info">
                    <p className="aside-title-sm">{n.titulo || "Sin título"}</p>
                    {n.categoria && (
                      <span className="aside-cat">{n.categoria}</span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
            {more.length === 0 && <li className="aside-empty">Sin datos</li>}
          </ul>
        </aside>
      </div>
    </div>
  );
}
