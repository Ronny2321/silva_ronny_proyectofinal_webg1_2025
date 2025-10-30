import { useEffect, useMemo, useState } from "react";
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

  const grouped = useMemo(() => {
    const map = new Map();
    for (const it of items) {
      const cat = it.categoria || it.section || "General";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat).push(it);
    }
    return Array.from(map.entries()).sort((a, b) =>
      a[0].localeCompare(b[0], "es")
    );
  }, [items]);

  if (loading) return <p style={{ padding: 16 }}>Cargando noticias…</p>;
  if (!items.length)
    return <p style={{ padding: 16 }}>No hay noticias publicadas.</p>;

  return (
    <div style={{ padding: 16, display: "grid", gap: 24 }}>
      {grouped.map(([cat, list]) => (
        <section key={cat}>
          <h2 style={{ margin: "8px 0" }}>{cat}</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {list.map((n) => (
              <NewsCard key={n.id} news={n} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Home;
