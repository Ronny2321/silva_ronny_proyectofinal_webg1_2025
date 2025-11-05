import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import db, { auth } from "../../FirebaseConfig/FirebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import useCategoriesCollection from "../../hooks/getCategorias.js";
import "./CreateNews.css";

const CreateNews = ({ role: roleProp }) => {
  const [noticia, setNoticia] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(roleProp || null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState({ open: false, title: "", text: "" });
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

  const handleSave = async () => {
    try {
      setSaving(true);
      const colRef = collection(db, "Noticias");
      const nowHuman = new Date().toLocaleDateString("es-CO");
      const chosen = noticia.estado ?? "Edición";
      const finalStatus = allowedStatuses.includes(chosen) ? chosen : "Edición";
      await addDoc(colRef, {
        ...noticia,
        contenido: noticia.contenido ?? noticia.noticia,
        categoria:
          noticia.categoria || noticia.section || CATEGORIES[0] || "General",
        estado: finalStatus,
        autor: currentUser?.email || "",
        authorId: currentUser?.uid || "",
        fechaCreacion: nowHuman,
        fechaActualizacion: nowHuman,
      });
      setNotice({
        open: true,
        title: "Noticia creada",
        text: `Se creó "${noticia.titulo || "Nueva noticia"}" correctamente.`,
      });
    } catch (e) {
      console.error("Error guardando noticia", e);
    } finally {
      setSaving(false);
    }
  };

  const selectedCategory =
    noticia.categoria || noticia.section || CATEGORIES[0] || "General";
  const showStatus = role === "Editor";

  return (
    <>
      <div className="create-page">
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
          <section className="panel">
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
                Imagen (URL)
              </label>
              <input
                id="imagen"
                className="input"
                type="text"
                placeholder="https://..."
                value={noticia.imagen || ""}
                onChange={(e) =>
                  setNoticia({ ...noticia, imagen: e.target.value })
                }
              />
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
              <button
                className="btn-primary btn-lg"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Guardando…" : "Publicar"}
              </button>
            </div>
          </section>

          <aside className="panel preview" aria-label="Vista previa">
            {noticia.imagen ? (
              <img
                className="preview-image"
                src={noticia.imagen}
                alt="Vista previa"
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
      </div>
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
