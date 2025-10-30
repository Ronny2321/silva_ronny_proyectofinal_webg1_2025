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
      <input
        type="text"
        placeholder="Categoría"
        onChange={(e) =>
          setNoticia({
            ...noticia,
            section: e.target.value,
            categoria: e.target.value,
          })
        }
      />
      <select
        value={noticia.status || noticia.estado || "Edición"}
        onChange={(e) => {
          const val = e.target.value;
          setNoticia({
            ...noticia,
            estado: val,
            status: val,
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
            const chosen = noticia.status ?? noticia.estado ?? "Edición";
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
