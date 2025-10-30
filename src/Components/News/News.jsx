import { useState, useEffect } from "react";
import "./News.css";
import NewsCard from "../NewsCard/NewsCard.jsx";
import db, { auth } from "../../FirebaseConfig/FirebaseConfig.js";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";
import EditNewsModal from "../EditNewsModal/EditNewsModal.jsx";

const News = ({ role }) => {
  const [news, setNews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uid, setUid] = useState(null);

  const loadNews = async (currentUid) => {
    try {
      const colRef = collection(db, "Noticias");
      const q = query(colRef, where("authorId", "==", currentUid));
      const snap = await getDocs(q);
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setNews(items);
    } catch (err) {
      console.error("Error cargando noticias:", err);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      const id = u?.uid || null;
      setUid(id);
      if (id) loadNews(id);
      else setNews([]);
    });
    return () => unsub();
  }, []);

  return (
    <main>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <Link to="/crear">
          <button>Crear noticia</button>
        </Link>
      </div>
      {news.length > 0 ? (
        news.map((n) => (
          <div key={n.id} style={{ marginBottom: 12 }}>
            <NewsCard news={n} />
            <div style={{ marginTop: 6 }}>
              {(n.estado || n.status) !== "Publicado" || role === "Editor" ? (
                <button
                  onClick={() => {
                    setEditingId(n.id);
                    setIsModalOpen(true);
                  }}
                >
                  Editar
                </button>
              ) : (
                <span style={{ color: "#666", fontSize: 12 }}>
                  Publicado (no editable)
                </span>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>Cargando noticias...</p>
      )}
      <EditNewsModal
        open={isModalOpen}
        newsId={editingId}
        role={role}
        onClose={async (saved) => {
          setIsModalOpen(false);
          setEditingId(null);
          if (saved && uid) await loadNews(uid);
        }}
      />
    </main>
  );
};

export default News;
