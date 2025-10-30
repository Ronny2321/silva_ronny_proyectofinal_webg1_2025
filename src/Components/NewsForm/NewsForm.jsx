import { useMemo, useState, useEffect } from "react";
import db, { auth } from "../../FirebaseConfig/FirebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

const NewsForm = ({ role }) => {
  const [noticia, setNoticia] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

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

  return (
    <div>
      <h2>News Form Component</h2>
      <input
        type="text"
        placeholder="Titulo"
        onChange={(e) => setNoticia({ ...noticia, titulo: e.target.value })}
      />
      <input
        type="text"
        placeholder="Subtitulo"
        onChange={(e) => setNoticia({ ...noticia, subtitulo: e.target.value })}
      />
      <input
        type="text"
        placeholder="Imagen"
        onChange={(e) => setNoticia({ ...noticia, imagen: e.target.value })}
      />
      <textarea
        placeholder="Contenido"
        onChange={(e) => setNoticia({ ...noticia, contenido: e.target.value })}
      ></textarea>
      <select
        value={noticia.section || noticia.categoria || "General"}
        onChange={(e) =>
          setNoticia({
            ...noticia,
            section: e.target.value,
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
        value={noticia.estado || "Edición"}
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
      <button
        onClick={async () => {
          try {
            const colRef = collection(db, "Noticias");
            const nowHuman = new Date().toLocaleDateString("es-CO");
            const chosen = noticia.estado ?? "Edición";
            const finalStatus = allowedStatuses.includes(chosen)
              ? chosen
              : "Edición";
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
          } catch (e) {
            console.error("Error guardando noticia", e);
          }
        }}
      >
        Guardar Noticia
      </button>
    </div>
  );
};

export default NewsForm;
