import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import db, { storage, auth } from "../FirebaseConfig/FirebaseConfig";
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
import { doc as docRef, getDoc as getDocOnce } from "firebase/firestore";

const initial = {
  titulo: "",
  subtitulo: "",
  contenido: "",
  categoria: "General",
  imagen: "",
  estado: "Edición",
};

const NewsEditor = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState(initial);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [role, setRole] = useState("Reportero");

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

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const refDoc = doc(db, "Noticias", id);
      const snap = await getDoc(refDoc);
      if (snap.exists()) {
        const data = snap.data();
        setForm({
          ...initial,
          ...data,
          estado: data.estado || "Edición",
        });
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    const loadCategorias = async () => {
      const snap = await getDocs(collection(db, "Categorias"));
      setCategorias(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    loadCategorias();
  }, []);

  useEffect(() => {
    const fetchRole = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      try {
        const r = await getDocOnce(docRef(db, "users", uid));
        if (r.exists()) setRole(r.data().role || "Reportero");
      } catch (e) {
        console.error("Error cargando rol", e);
      }
    };
    fetchRole();
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

      const current = form.estado || "Edición";
      const allowedNow =
        role === "Editor"
          ? editorTransitions(current)
          : ["Edición", "Terminado"];
      const finalStatus = allowedNow.includes(current) ? current : "Edición";

      if (id) {
        await updateDoc(doc(db, "Noticias", id), {
          ...form,
          imagen: imageUrl,
          estado: finalStatus,
          fechaActualizacion: serverTimestamp(),
        });
      } else {
        const colRef = collection(db, "Noticias");
        await addDoc(colRef, {
          ...form,
          imagen: imageUrl,
          authorId: auth.currentUser?.uid || "",
          autor: auth.currentUser?.email || "",
          estado: finalStatus,
          fechaCreacion: serverTimestamp(),
          fechaActualizacion: serverTimestamp(),
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
        <label style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
          Estado:
          <select
            value={form.estado || "Edición"}
            onChange={(e) => setForm({ ...form, estado: e.target.value })}
            disabled={
              role === "Editor" &&
              (form.estado || "Edición") === "Edición"
            }
          >
            {(role === "Editor"
              ? editorTransitions(form.estado || "Edición")
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
          value={form.categoria}
          onChange={(e) => setForm({ ...form, categoria: e.target.value })}
        >
          <option value="General">General</option>
          {categorias.map((s) => (
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
