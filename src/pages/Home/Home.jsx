import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import db from "../../FirebaseConfig/FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import "./Home.css";

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

  const sorted = useMemo(() => {
    const toTime = (n) => {
      const f = n.fechaPublicacion || n.fecha || n.fechaCreacion;
      if (!f) return 0;
      try {
        if (typeof f === "string") return new Date(f).getTime() || 0;
        if (f?.toDate) return f.toDate().getTime() || 0;
        return new Date(f).getTime() || 0;
      } catch {
        return 0;
      }
    };
    return [...items].sort((a, b) => toTime(b) - toTime(a));
  }, [items]);

  const featured = sorted[0];
  const recent = sorted.slice(1, 6);

  if (loading) return <p style={{ padding: 16 }}>Cargando noticias…</p>;
  if (!items.length)
    return <p style={{ padding: 16 }}>No hay noticias publicadas.</p>;

  return (
    <div className="home-shell">
      {featured && (
        <div className="home-top">
          <Link className="featured-card" to={`/noticia/${featured.id}`}>
            {featured.imagen ? (
              <img
                src={featured.imagen}
                alt={featured.titulo || "Noticia destacada"}
              />
            ) : (
              <div className="featured-ph" aria-hidden />
            )}
            <div className="featured-overlay">
              {featured.categoria && (
                <span className="badge-cat">{featured.categoria}</span>
              )}
              <h1 className="featured-title">
                {featured.titulo || "Sin título"}
              </h1>
              {featured.subtitulo && (
                <p className="featured-sub">{featured.subtitulo}</p>
              )}
            </div>
          </Link>
          <aside className="home-aside">
            <h3 className="aside-h">Más recientes</h3>
            <ul className="aside-list">
              {recent.map((n) => (
                <li key={n.id}>
                  <Link to={`/noticia/${n.id}`} className="aside-item">
                    <div className={"aside-thumb" + (n.imagen ? "" : " blank")}>
                      {n.imagen && <img src={n.imagen} alt="" loading="lazy" />}
                    </div>
                    <div className="aside-info">
                      <p className="aside-title">{n.titulo || "Sin título"}</p>
                      {n.categoria && (
                        <span className="aside-cat">{n.categoria}</span>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
              {recent.length === 0 && (
                <li className="aside-empty">Sin datos</li>
              )}
            </ul>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Home;
