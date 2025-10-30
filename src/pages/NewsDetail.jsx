import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import db from "../FirebaseConfig/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

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

  if (loading) return <p style={{ padding: 16 }}>Cargando…</p>;
  if (error) return <p style={{ padding: 16 }}>{error}</p>;
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

  return (
    <article
      style={{
        padding: 16,
        display: "grid",
        gap: 12,
        maxWidth: 920,
        margin: "0 auto",
      }}
    >
      <Link to="/home" style={{ textDecoration: "none" }}>
        ← Volver
      </Link>
      <h1 style={{ margin: 0 }}>{item.titulo}</h1>
      {item.subtitulo && (
        <h3 style={{ color: "#666", marginTop: 0 }}>{item.subtitulo}</h3>
      )}
      {fechaStr && (
        <span style={{ color: "#888", fontSize: 14 }}>
          Publicado: {fechaStr}
        </span>
      )}
      {item.imagen && (
        <img
          src={item.imagen}
          alt={item.titulo}
          style={{
            width: "100%",
            maxHeight: 520,
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      )}
      {item.categoria && (
        <strong style={{ marginTop: 8 }}>Sección: {item.categoria}</strong>
      )}
      <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.7, fontSize: 18 }}>
        {item.contenido}
      </div>
    </article>
  );
}
