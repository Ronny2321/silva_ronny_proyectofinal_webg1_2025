import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import db from "../../FirebaseConfig/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

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

  if (loading) return <Container sx={{ py: 4 }}><Typography>Cargando…</Typography></Container>;
  if (error) return <Container sx={{ py: 4 }}><Typography>{error}</Typography></Container>;
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
    <Container sx={{ py: 4, maxWidth: 920 }}>
      <Button component={Link} to="/home" variant="text">← Volver</Button>
      <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>{item.titulo}</Typography>
      {item.subtitulo && (
        <Typography variant="h6" sx={{ color: 'text.secondary', mt: -1, mb: 1 }}>{item.subtitulo}</Typography>
      )}
      {fechaStr && (
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>Publicado: {fechaStr}</Typography>
      )}
      {item.imagen && (
        <img
          src={item.imagen}
          alt={item.titulo}
          style={{ width: '100%', maxHeight: 520, objectFit: 'cover', borderRadius: 12 }}
        />
      )}
      {item.categoria && (
        <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: 700 }}>Sección: {item.categoria}</Typography>
      )}
      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.9, fontSize: 18, mt: 1 }}>
        {item.contenido}
      </Typography>
    </Container>
  );
}
