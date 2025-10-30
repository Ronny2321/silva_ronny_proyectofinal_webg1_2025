import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import db, { storage } from "../FirebaseConfig/FirebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "../FirebaseConfig/FirebaseConfig";

const initial = {
  titulo: "",
  subtitulo: "",
  contenido: "",
  section: "General",
  imagen: "",
  status: "Edición",
};

const NewsEditor = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState(initial);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const refDoc = doc(db, "Noticias", id);
      const snap = await getDoc(refDoc);
      if (snap.exists()) setForm({ ...initial, ...snap.data() });
    };
    load();
  }, [id]);

  useEffect(() => {
    const loadSections = async () => {
      const snap = await getDocs(collection(db, "Secciones"));
      setSections(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    loadSections();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = form.imagen;
      if (file) {
        const storageRef = ref(storage, `news/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
      }

      if (id) {
        await updateDoc(doc(db, "Noticias", id), {
          ...form,
          imagen: imageUrl,
          updatedAt: serverTimestamp(),
        });
      } else {
        const colRef = collection(db, "Noticias");
        await addDoc(colRef, {
          ...form,
          imagen: imageUrl,
          authorId: auth.currentUser?.uid || "",
          autor: auth.currentUser?.email || "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      nav("/");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>{id ? "Editar" : "Crear"} noticia</h3>
      <form onSubmit={onSubmit}>
        <input
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          placeholder="Título"
          required
        />
        <input
          value={form.subtitulo}
          onChange={(e) => setForm({ ...form, subtitulo: e.target.value })}
          placeholder="Subtítulo"
        />
        <textarea
          value={form.contenido}
          onChange={(e) => setForm({ ...form, contenido: e.target.value })}
          placeholder="Contenido"
        />
        <select
          value={form.section}
          onChange={(e) => setForm({ ...form, section: e.target.value })}
        >
          <option value="General">General</option>
          {sections.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        {form.imagen && (
          <img src={form.imagen} alt="prev" style={{ width: 160 }} />
        )}
        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  );
};

export default NewsEditor;
