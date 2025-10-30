import React, { useEffect, useState } from "react";
import Modal from "../Modal/Modal.jsx";
import db from "../../FirebaseConfig/FirebaseConfig.js";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";

const EditNewsModal = ({ open, onClose, newsId, role }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    titulo: "",
    subtitulo: "",
    contenido: "",
    section: "",
    imagen: "",
  });
  const [published, setPublished] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!open || !newsId) return;
      setLoading(true);
      setError("");
      try {
        const ref = doc(db, "Noticias", newsId);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          setError("La noticia no existe");
          return;
        }
        const data = snap.data();
        setForm((f) => ({ ...f, ...data }));
        const pub = (data.estado || data.status) === "Publicado";
        setPublished(pub);
      } catch (e) {
        console.error(e);
        setError("Error cargando la noticia");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [open, newsId]);

  const handleSave = async () => {
    if (role === "Reportero" && published) {
      setError("Las noticias publicadas no pueden ser editadas por reporteros");
      return;
    }
    setLoading(true);
    try {
      await updateDoc(doc(db, "Noticias", newsId), {
        titulo: form.titulo || "",
        subtitulo: form.subtitulo || "",
        contenido: form.contenido || "",
        section: form.section || "",
        imagen: form.imagen || "",
        updatedAt: serverTimestamp(),
      });
      onClose?.(true);
    } catch (e) {
      console.error(e);
      setError("Error guardando cambios");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Editar noticia"
      maxWidth="md"
      actions={
        <>
          <button onClick={() => onClose?.(false)} disabled={loading}>
            Cancelar
          </button>
          <button onClick={handleSave} disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </>
      }
    >
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <div style={{ display: "grid", gap: 12 }}>
        <input
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          placeholder="Título"
          disabled={role === "Reportero" && published}
        />
        <input
          value={form.subtitulo}
          onChange={(e) => setForm({ ...form, subtitulo: e.target.value })}
          placeholder="Subtítulo"
          disabled={role === "Reportero" && published}
        />
        <textarea
          value={form.contenido}
          onChange={(e) => setForm({ ...form, contenido: e.target.value })}
          placeholder="Contenido"
          rows={6}
          disabled={role === "Reportero" && published}
        />
        <input
          value={form.section}
          onChange={(e) => setForm({ ...form, section: e.target.value })}
          placeholder="Sección o categoría"
          disabled={role === "Reportero" && published}
        />
        <input
          type="url"
          value={form.imagen}
          onChange={(e) => setForm({ ...form, imagen: e.target.value })}
          placeholder="URL de la imagen (https://...)"
          disabled={role === "Reportero" && published}
        />
        {form.imagen && (
          <img src={form.imagen} alt="prev" style={{ width: 160 }} />
        )}
      </div>
    </Modal>
  );
};

export default EditNewsModal;
