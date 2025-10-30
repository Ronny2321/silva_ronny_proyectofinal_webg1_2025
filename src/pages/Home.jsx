import { useEffect, useState } from "react";
import db from "../FirebaseConfig/FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import NewsCard from "../Components/NewsCard/NewsCard";

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const q = query(
          collection(db, "Noticias"),
          where("estado", "==", "Publicado")
        );
        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setItems(data);
      } catch (e) {
        console.error("Error cargando noticias publicadas", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p style={{ padding: 16 }}>Cargando noticias…</p>;
  if (!items.length)
    return <p style={{ padding: 16 }}>No hay noticias publicadas.</p>;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 16,
        padding: 16,
      }}
    >
      {items.map((n) => (
        <NewsCard key={n.id} news={n} />
      ))}
    </div>
  );
};

export default Home;
