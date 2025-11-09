import React, { useEffect, useMemo, useRef, useState } from "react";
import Modal from "../../Components/Modal/Modal.jsx";
import db from "../../FirebaseConfig/FirebaseConfig.js";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import useCategoriesCollection from "../../hooks/getCategorias.js";
import { uploadImage } from "../../SupabaseConfig/imageUpload.js";
import "./EditNewsModal.css";

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
  const { categories: CATEGORIES } = useCategoriesCollection(["General"]);
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
  const [toastOk, setToastOk] = useState(false);
  const [closing, setClosing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const timers = useRef([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      event.target.value = "";
    }
  };

  useEffect(() => {
    const load = async () => {
      if (!open || !newsId) return;
      setLoading(true);
      setError("");
      setSelectedFile(null);
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

    if (!form.titulo.trim() || !form.contenido.trim()) {
      setError("El título y contenido son obligatorios");
      return;
    }

    setLoading(true);
    setUploadingImage(true);

    try {
      let imageUrl = form.imagen;

      if (selectedFile) {
        const imageName = `noticia-${newsId}`;

        const result = await uploadImage(selectedFile, imageName);
        if (result.success) {
          imageUrl = result.url;
        } else {
          throw new Error(result.error || "Error al subir la imagen");
        }
        setSelectedFile(null);
      }

      await updateDoc(doc(db, "Noticias", newsId), {
        titulo: form.titulo.trim(),
        subtitulo: form.subtitulo.trim(),
        contenido: form.contenido.trim(),
        categoria: form.categoria || "",
        imagen: imageUrl || "",
        estado: estado,
        fechaActualizacion: serverTimestamp(),
      });

      setToastOk(true);
      timers.current.push(setTimeout(() => setClosing(true), 650));
      timers.current.push(setTimeout(() => onClose?.(true), 650 + 220));
    } catch (e) {
      console.error(e);
      setError("Error guardando cambios: " + (e.message || e));
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    return () => {
      timers.current.forEach((t) => clearTimeout(t));
      timers.current = [];
      setToastOk(false);
      setClosing(false);
      setSelectedFile(null);
    };
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      maxWidth="md"
      rootClassName={closing ? "closing" : ""}
      actions={
        <>
          <button
            className="btn btn-outline"
            onClick={() => onClose?.(false)}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading
              ? uploadingImage
                ? "Subiendo imagen..."
                : "Guardando..."
              : "Guardar"}
          </button>
        </>
      }
    >
      <div className="em-header">
        <h3 className="modal-title">Editar noticia</h3>
        <span
          className={
            "em-badge " +
            (estado === "Publicado"
              ? "ok"
              : estado === "Terminado"
              ? "info"
              : estado === "Desactivado"
              ? "off"
              : "warn")
          }
        >
          {estado}
        </span>
      </div>

      {error && <p className="em-error">{error}</p>}

      <div className="em-grid">
        <div className="group">
          <label className="label" htmlFor="estado">
            Estado
          </label>
          <select
            id="estado"
            className="select"
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
        </div>

        <div className="group">
          <label className="label" htmlFor="titulo">
            Título
          </label>
          <input
            id="titulo"
            className="input"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            placeholder="Título"
            disabled={role === "Reportero" && published}
          />
        </div>

        <div className="group">
          <label className="label" htmlFor="subtitulo">
            Subtítulo
          </label>
          <input
            id="subtitulo"
            className="input"
            value={form.subtitulo}
            onChange={(e) => setForm({ ...form, subtitulo: e.target.value })}
            placeholder="Subtítulo"
            disabled={role === "Reportero" && published}
          />
        </div>

        <div className="group">
          <label className="label" htmlFor="contenido">
            Contenido
          </label>
          <textarea
            id="contenido"
            className="textarea"
            value={form.contenido}
            onChange={(e) => setForm({ ...form, contenido: e.target.value })}
            placeholder="Contenido"
            rows={6}
            disabled={role === "Reportero" && published}
          />
        </div>

        <div className="group">
          <label className="label" htmlFor="categoria">
            Categoría
          </label>
          <select
            id="categoria"
            className="select"
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
        </div>

        <div className="group">
          <label className="label" htmlFor="imagen">
            Imagen
          </label>
          <div className="image-upload-container">
            <input
              type="file"
              id="edit-image-file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
              style={{ display: "none" }}
              disabled={role === "Reportero" && published}
            />
            <label
              htmlFor="edit-image-file"
              className={`upload-button ${
                role === "Reportero" && published ? "disabled" : ""
              } ${selectedFile ? "file-selected" : ""}`}
            >
              {uploadingImage
                ? "Subiendo..."
                : selectedFile
                ? `Nueva imagen: ${selectedFile.name}`
                : "Seleccionar imagen"}
            </label>
            <input
              id="imagen"
              type="url"
              className="input"
              value={form.imagen}
              onChange={(e) => setForm({ ...form, imagen: e.target.value })}
              placeholder="O pega una URL: https://..."
              disabled={role === "Reportero" && published}
            />
          </div>
          {form.imagen && (
            <div className="image-preview-small">
              <img
                src={form.imagen}
                alt="Vista previa"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
          )}
        </div>
      </div>

      {toastOk && (
        <div className="em-toast" role="status" aria-live="polite">
          <div className="em-toast-icon" aria-hidden>
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
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          Cambios guardados
        </div>
      )}
    </Modal>
  );
};

export default EditNewsModal;
