import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import db from "../../FirebaseConfig/FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import "./Home.css";

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);

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

  const slides = useMemo(() => {
    const byCat = new Map();
    const timeOf = (n) => {
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
    for (const n of sorted) {
      const cat = n.categoria || "General";
      const current = byCat.get(cat);
      if (!current || timeOf(n) > timeOf(current)) byCat.set(cat, n);
    }
    return Array.from(byCat.values());
  }, [sorted]);

  const recent = useMemo(() => {
    const used = new Set(slides.map((s) => s.id));
    return sorted.filter((n) => !used.has(n.id)).slice(0, 5);
  }, [sorted, slides]);

  useEffect(() => {
    if (!slides.length || slides.length === 1) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 3000);
    return () => clearInterval(id);
  }, [slides.length]);

  useEffect(() => {
    setCurrent(0);
  }, [slides.length]);

  if (loading) return <p style={{ padding: 16 }}>Cargando noticias…</p>;
  if (!items.length)
    return <p style={{ padding: 16 }}>No hay noticias publicadas.</p>;

  return (
    <div className="home-shell">
      {slides.length > 0 && (
        <div className="home-top">
          <div className="carousel">
            <div
              className="slides"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {slides.map((s) => (
                <Link key={s.id} className="slide" to={`/noticia/${s.id}`}>
                  {s.imagen ? (
                    <img
                      src={s.imagen}
                      alt={s.titulo || "Noticia destacada"}
                      loading="lazy"
                    />
                  ) : (
                    <div className="featured-ph" aria-hidden />
                  )}
                  <div className="featured-overlay">
                    {s.categoria && (
                      <span className="badge-cat">{s.categoria}</span>
                    )}
                    <h1 className="featured-title">
                      {s.titulo || "Sin título"}
                    </h1>
                    {s.subtitulo && (
                      <p className="featured-sub">{s.subtitulo}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            {slides.length > 1 && (
              <div
                className="dots"
                role="tablist"
                aria-label="Destacadas por categoría"
              >
                {slides.map((_, i) => (
                  <button
                    key={i}
                    className={"dot" + (i === current ? " active" : "")}
                    onClick={() => setCurrent(i)}
                    aria-label={`Ir a slide ${i + 1}`}
                    aria-selected={i === current}
                  />
                ))}
              </div>
            )}
          </div>
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
