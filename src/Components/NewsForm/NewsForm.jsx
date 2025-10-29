import { useState, useEffect } from "react";
import db from "../../FirebaseConfig/FirebaseConfig.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const NewsForm = () => {
  const [noticia, setNoticia] = useState({});

  useEffect(() => {
    console.log(noticia);
  }, [noticia]);

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
        placeholder="Categoría / Sección"
        onChange={(e) =>
          setNoticia({
            ...noticia,
            section: e.target.value,
            categoria: e.target.value,
          })
        }
      />
      <input
        type="text"
        placeholder="Autor"
        onChange={(e) => setNoticia({ ...noticia, autor: e.target.value })}
      />
      <select
        defaultValue="Edición"
        onChange={(e) =>
          setNoticia({
            ...noticia,
            estado: e.target.value,
            status: e.target.value,
          })
        }
      >
        <option value="Edición">Edición</option>
        <option value="Terminado">Terminado</option>
        <option value="Publicado">Publicado</option>
        <option value="Desactivado">Desactivado</option>
      </select>
      <button
        onClick={async () => {
          try {
            const colRef = collection(db, "Noticias");
            const nowHuman = new Date().toLocaleDateString("es-CO");
            await addDoc(colRef, {
              ...noticia,
              contenido: noticia.contenido ?? noticia.noticia,
              section: noticia.section ?? noticia.categoria,
              status: noticia.status ?? noticia.estado ?? "Edición",
              fechaCreacion: nowHuman,
              fechaActualizacion: nowHuman,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
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
