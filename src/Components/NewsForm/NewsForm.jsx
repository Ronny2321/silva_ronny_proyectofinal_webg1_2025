import { useState, useEffect } from "react";
import db from "../../FirebaseConfig/FirebaseConfig.js";
import { collection, addDoc } from "firebase/firestore";

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
        placeholder="Fecha"
        onChange={(e) => setNoticia({ ...noticia, fecha: e.target.value })}
      />
      <input
        type="text"
        placeholder="Imagen"
        onChange={(e) => setNoticia({ ...noticia, imagen: e.target.value })}
      />
      <textarea
        placeholder="Noticia"
        onChange={(e) => setNoticia({ ...noticia, noticia: e.target.value })}
      ></textarea>
      <button
        onClick={async () => {
          try {
            const colRef = collection(db, "Noticias");
            await addDoc(colRef, noticia); 
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
