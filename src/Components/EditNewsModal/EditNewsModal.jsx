import React, { useEffect, useMemo, useState } from "react";
import Modal from "../Modal/Modal.jsx";
import db from "../../FirebaseConfig/FirebaseConfig.js";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";

const EditNewsModal = ({ open, onClose, newsId, role }) => {
  const editorTransitions = useMemo(
    () => (current) => {
      const s = current || "Edición";
      if (s === "Edición") return [s];
      if (s === "Terminado") return [s, "Publicado", "Desactivado"];
      if (s === "Publicado") return [s, "Desactivado"];
      if (s === "Desactivado") return [s, "Publicado"];
      return [s];
    },
    []
  );
  const CATEGORIES = useMemo(
    () => [
      "General",
      "Tecnología",
      "Política",
      "Deportes",
      "Economía",
      "Salud",
      "Cultura",
      "Entretenimiento",
      "Ciencia",
      "Internacional",
      "Nacional",
    ],
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    titulo: "",
    subtitulo: "",
    contenido: "",
    categoria: "",
    imagen: "",
  });
  const [published, setPublished] = useState(false);
  const [estado, setStatus] = useState("Edición");

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
  const currentStatus = data.status || data.estado || "Edición";
  setStatus(currentStatus);
  const pub = currentStatus === "Publicado";
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
        categoria: form.categoria || "",
        imagen: form.imagen || "",
        estado: estado,
        fechaActualizacion: serverTimestamp(),
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
        <label style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
          Estado:
          <select
            value={estado}
            onChange={(e) => setStatus(e.target.value)}
            disabled={
              (role === "Reportero" && published) ||
              (role === "Editor" && estado === "Edición")
            }
          >
            {(role === "Editor"
              ? editorTransitions(estado)
              : ["Edición", "Terminado"]
            ).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
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
        <select
          value={form.categoria || "General"}
          onChange={(e) => setForm({ ...form, categoria: e.target.value })}
          disabled={role === "Reportero" && published}
        >
          {CATEGORIES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
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
