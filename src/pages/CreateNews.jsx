import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import db, { auth } from "../FirebaseConfig/FirebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

const CreateNews = ({ role }) => {
  const [noticia, setNoticia] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const nav = useNavigate();

  const allowedStatuses = useMemo(
    () =>
      role === "Editor"
        ? ["Edición", "Terminado", "Publicado", "Desactivado"]
        : ["Edición", "Terminado"],
    [role]
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

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setCurrentUser(u));
    return () => unsub();
  }, []);

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
        categoria: noticia.categoria ?? noticia.categoria,
        estado: finalStatus,
        autor: currentUser?.email || "",
        authorId: currentUser?.uid || "",
        fechaCreacion: nowHuman,
        fechaActualizacion: nowHuman,
      });
      alert("Noticia guardada");
      nav("/");
    } catch (e) {
      console.error("Error guardando noticia", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 12 }}>
      <h2>Crear noticia</h2>
      <div style={{ display: "grid", gap: 10, maxWidth: 700 }}>
        <input
          type="text"
          placeholder="Titulo"
          onChange={(e) => setNoticia({ ...noticia, titulo: e.target.value })}
        />
        <input
          type="text"
          placeholder="Subtitulo"
          onChange={(e) =>
            setNoticia({ ...noticia, subtitulo: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Imagen (URL)"
          onChange={(e) => setNoticia({ ...noticia, imagen: e.target.value })}
        />
        <textarea
          placeholder="Contenido"
          onChange={(e) =>
            setNoticia({ ...noticia, contenido: e.target.value })
          }
          rows={6}
        />
        <select
          value={noticia.categoria || "General"}
          onChange={(e) =>
            setNoticia({
              ...noticia,
              categoria: e.target.value,
            })
          }
        >
          {CATEGORIES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <select
          value={noticia.estado || noticia.estado || "Edición"}
          onChange={(e) => {
            const val = e.target.value;
            setNoticia({
              ...noticia,
              estado: val,
            });
          }}
        >
          {allowedStatuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <div>
          <button onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : "Guardar Noticia"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNews;
