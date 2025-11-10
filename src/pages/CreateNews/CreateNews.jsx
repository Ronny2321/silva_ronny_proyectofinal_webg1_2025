import React, { useEffect, useMemo, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { formAnimations, getAnimationVariant } from "../../utils/animations";
import { useNavigate } from "react-router-dom";
import db, { auth } from "../../FirebaseConfig/FirebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import useCategoriesCollection from "../../hooks/getCategorias.js";
import { uploadImage } from "../../SupabaseConfig/imageUpload.js";
import "./CreateNews.css";
import AnimatedPageLayout from "../../Components/Animations/AnimatedPageLayout/AnimatedPageLayout.jsx";
import Loader from "../../Components/Loader/Loader.jsx";
import LazyImage from "../../Components/Animations/LazyImage/LazyImage.jsx";

const CreateNews = ({ role: roleProp }) => {
  const [noticia, setNoticia] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(roleProp || null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState({ open: false, title: "", text: "" });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const nav = useNavigate();

  const allowedStatuses = useMemo(
    () =>
      role === "Editor"
        ? ["Edición", "Terminado", "Publicado", "Desactivado"]
        : ["Edición", "Terminado"],
    [role]
  );

  const { categories: CATEGORIES } = useCategoriesCollection(["Otro"]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setCurrentUser(u);
      if (u && !roleProp) {
        try {
          const snap = await getDoc(doc(db, "users", u.uid));
          const r = snap.exists() ? snap.data()?.role : null;
          if (r) setRole(r);
        } catch {
          /* Ignorar errores al obtener rol del usuario */
        }
      }
    });
    return () => unsub();
  }, [roleProp]);

  useEffect(() => {
    return () => {
      if (selectedFile && noticia.imagen?.startsWith("blob:")) {
        URL.revokeObjectURL(noticia.imagen);
      }
    };
  }, [selectedFile, noticia.imagen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const tempUrl = URL.createObjectURL(file);
      setNoticia((prev) => ({ ...prev, imagen: tempUrl }));
    }
  };

  const handleSave = async () => {
    if (!noticia.titulo?.trim()) {
      setNotice({
        open: true,
        title: "Campo requerido",
        text: "El título es obligatorio para crear la noticia.",
      });
      return;
    }

    if (!noticia.contenido?.trim()) {
      setNotice({
        open: true,
        title: "Campo requerido",
        text: "El contenido es obligatorio para crear la noticia.",
      });
      return;
    }

    try {
      setSaving(true);
      const colRef = collection(db, "Noticias");
      const nowHuman = new Date().toLocaleDateString("es-CO");
      const chosen = noticia.estado ?? "Edición";
      const finalStatus = allowedStatuses.includes(chosen) ? chosen : "Edición";

      const newsData = {
        titulo: noticia.titulo || "",
        subtitulo: noticia.subtitulo || "",
        contenido: noticia.contenido ?? noticia.noticia ?? "",
        categoria:
          noticia.categoria || noticia.section || CATEGORIES[0] || "General",
        estado: finalStatus,
        autor: currentUser?.email || "",
        authorId: currentUser?.uid || "",
        fechaCreacion: nowHuman,
        fechaActualizacion: nowHuman,
        imagen:
          selectedFile || noticia.imagen?.startsWith("blob:")
            ? ""
            : noticia.imagen || "",
      };

      const docRef = await addDoc(colRef, newsData);
      const newsId = docRef.id;

      if (selectedFile) {
        setUploadingImage(true);
        try {
          const result = await uploadImage(selectedFile, `noticia-${newsId}`);

          if (result && result.success) {
            await updateDoc(doc(db, "Noticias", newsId), {
              imagen: result.url,
              fechaActualizacion: nowHuman,
            });

            setNotice({
              open: true,
              title: "Noticia creada correctamente",
              text: `Se creó "${
                noticia.titulo || "Nueva noticia"
              }" con imagen correctamente.`,
            });
          } else {
            setNotice({
              open: true,
              title: "Noticia creada correctamente (error en imagen)",
              text: `Se creó "${
                noticia.titulo || "Nueva noticia"
              }" pero falló la subida de imagen: ${
                result?.error || "Error desconocido"
              }`,
            });
          }
        } catch (imageError) {
          console.error("Error subiendo imagen:", imageError);
          setNotice({
            open: true,
            title: "Noticia creada (error en imagen)",
            text: `Se creó "${
              noticia.titulo || "Nueva noticia"
            }" pero hubo un error al subir la imagen.`,
          });
        } finally {
          setUploadingImage(false);
        }
      } else {
        setNotice({
          open: true,
          title: "Noticia creada",
          text: `Se creó "${noticia.titulo || "Nueva noticia"}" correctamente.`,
        });
      }

      setTimeout(() => {
        if (noticia.imagen?.startsWith("blob:")) {
          URL.revokeObjectURL(noticia.imagen);
        }
        setNoticia({});
        setSelectedFile(null);
      }, 2000);
    } catch (e) {
      console.error("Error guardando noticia", e);
      setNotice({
        open: true,
        title: "Error",
        text: "Hubo un error al guardar la noticia. Inténtalo de nuevo.",
      });
    } finally {
      setSaving(false);
    }
  };

  const selectedCategory =
    noticia.categoria || noticia.section || CATEGORIES[0] || "General";
  const showStatus = role === "Editor";

  return (
    <>
      <AnimatedPageLayout className="create-page">
        <div className="back-bar">
          <button
            type="button"
            className="back-link"
            onClick={() => nav("/home")}
            aria-label="Volver al inicio"
          >
            Volver
          </button>
        </div>
        <h2 className="create-title">Crear noticia</h2>
        <p className="create-sub">
          Completa los campos y visualiza una vista previa en tiempo real.
        </p>
        <div className="create-grid appear">
          <motion.form
            className="panel"
            variants={getAnimationVariant(formAnimations)}
            initial="initial"
            animate="animate"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="group">
              <label className="label" htmlFor="titulo">
                Título
              </label>
              <input
                id="titulo"
                className="input"
                type="text"
                placeholder="Título de la noticia"
                value={noticia.titulo || ""}
                onChange={(e) =>
                  setNoticia({ ...noticia, titulo: e.target.value })
                }
              />
            </div>

            <div className="group">
              <label className="label" htmlFor="subtitulo">
                Subtítulo
              </label>
              <input
                id="subtitulo"
                className="input"
                type="text"
                placeholder="Subtítulo"
                value={noticia.subtitulo || ""}
                onChange={(e) =>
                  setNoticia({ ...noticia, subtitulo: e.target.value })
                }
              />
            </div>

            <div className="group">
              <label className="label" htmlFor="imagen">
                Imagen
              </label>
              <div className="image-upload-container">
                <input
                  type="file"
                  id="image-file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                  style={{ display: "none" }}
                />
                <label htmlFor="image-file" className="upload-button">
                  {uploadingImage
                    ? "Subiendo..."
                    : selectedFile
                    ? `📁 ${selectedFile.name}`
                    : "Seleccionar imagen"}
                </label>
                {selectedFile && (
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#059669",
                      marginTop: "4px",
                      fontWeight: "500",
                    }}
                  >
                    ✅ Archivo listo para subir al crear la noticia
                  </div>
                )}
                <input
                  id="imagen"
                  className="input"
                  type="text"
                  placeholder="O pega una URL: https://..."
                  value={selectedFile ? "" : noticia.imagen || ""}
                  onChange={(e) => {
                    setSelectedFile(null);
                    setNoticia({ ...noticia, imagen: e.target.value });
                  }}
                  disabled={!!selectedFile}
                />
              </div>
              {noticia.imagen && (
                <div className="image-preview-small">
                  <img src={noticia.imagen} alt="Preview" />
                </div>
              )}
            </div>

            <div className="group">
              <label className="label">Categoría</label>
              <div
                className="chips"
                role="listbox"
                aria-label="Categorías disponibles"
              >
                {CATEGORIES.map((name) => (
                  <button
                    key={name}
                    type="button"
                    role="option"
                    aria-selected={selectedCategory === name}
                    className={
                      "chip" + (selectedCategory === name ? " active" : "")
                    }
                    onClick={() =>
                      setNoticia({ ...noticia, categoria: name, section: name })
                    }
                  >
                    {name}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 8 }}>
                <select
                  className="select"
                  value={selectedCategory}
                  onChange={(e) =>
                    setNoticia({
                      ...noticia,
                      categoria: e.target.value,
                      section: e.target.value,
                    })
                  }
                >
                  {CATEGORIES.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {showStatus && (
              <div className="group">
                <label className="label" htmlFor="estado">
                  Estado
                </label>
                <select
                  id="estado"
                  className="select"
                  value={noticia.estado || "Edición"}
                  onChange={(e) =>
                    setNoticia({ ...noticia, estado: e.target.value })
                  }
                >
                  {allowedStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="group">
              <label className="label" htmlFor="contenido">
                Contenido
              </label>
              <div className="content-box">
                <textarea
                  id="contenido"
                  className="textarea"
                  placeholder="Escribe el contenido aquí…"
                  value={noticia.contenido || noticia.noticia || ""}
                  onChange={(e) =>
                    setNoticia({ ...noticia, contenido: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="sticky-actions">
              <motion.button
                type="submit"
                className="btn-primary btn-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                disabled={saving || uploadingImage}
              >
                {saving
                  ? uploadingImage
                    ? "Subiendo imagen..."
                    : "Guardando noticia..."
                  : "Publicar"}
              </motion.button>
            </div>
          </motion.form>

          <aside className="panel preview" aria-label="Vista previa">
            {noticia.imagen ? (
              <LazyImage
                className="preview-image"
                src={noticia.imagen}
                alt="Vista previa"
                threshold={0}
              />
            ) : (
              <div className="preview-image" aria-hidden />
            )}
            <div className="preview-body">
              <h3 className="preview-title">
                {noticia.titulo || "Título de la noticia"}
              </h3>
              <p className="preview-sub">
                {noticia.subtitulo || "Subtítulo o bajada de la nota"}
              </p>
            </div>
          </aside>
        </div>
      </AnimatedPageLayout>
      {(saving || uploadingImage) && (
        <Loader
          fullscreen
          message={
            saving
              ? uploadingImage
                ? "Subiendo imagen…"
                : "Guardando noticia…"
              : "Procesando…"
          }
        />
      )}
      {notice.open && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ok-title"
        >
          <div className="modal-card">
            <div className="modal-icon success" aria-hidden>
              <svg
                width="22"
                height="22"
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
            <h3 id="ok-title" className="modal-title">
              {notice.title}
            </h3>
            <p className="modal-text">{notice.text}</p>
            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={() => {
                  setNotice({ open: false, title: "", text: "" });
                  nav("/");
                }}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateNews;
