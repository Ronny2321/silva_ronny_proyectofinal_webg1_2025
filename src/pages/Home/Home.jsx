import { useEffect, useMemo, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  heroAnimations,
  cardAnimations,
  staggerContainer,
  getAnimationVariant,
} from "../../utils/animations";
import { Link } from "react-router-dom";
import AnimatedPageLayout from "../../Components/AnimatedPageLayout/AnimatedPageLayout.jsx";
import db from "../../FirebaseConfig/FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import "./Home.css";
import NewsCard from "../../Components/NewsCard/NewsCard.jsx";
import LazyImage from "../../Components/LazyImage/LazyImage.jsx";

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
    const MAX_SLIDES = 3;
    return sorted.slice(0, Math.min(MAX_SLIDES, sorted.length));
  }, [sorted]);

  const recent = useMemo(() => {
    const used = new Set(slides.map((s) => s.id));
    return sorted.filter((n) => !used.has(n.id)).slice(0, 5);
  }, [sorted, slides]);

  const baseGrid = useMemo(() => {
    const idsSlides = new Set(slides.map((s) => s.id));
    const idsRecent = new Set(recent.map((r) => r.id));
    const primary = sorted.filter(
      (n) => !idsSlides.has(n.id) && !idsRecent.has(n.id)
    );
    if (primary.length > 0) return primary;
    return sorted.filter((n) => !idsSlides.has(n.id));
  }, [sorted, slides, recent]);

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

  const allCategories = useMemo(() => {
    const set = new Set();
    for (const n of sorted) if (n.categoria) set.add(n.categoria);
    return ["Todas", ...Array.from(set).sort()];
  }, [sorted]);
  const [homeCat, setHomeCat] = useState("Todas");

  if (loading) return <p style={{ padding: 16 }}>Cargando noticias…</p>;
  if (!items.length)
    return <p style={{ padding: 16 }}>No hay noticias publicadas.</p>;

  return (
    <AnimatedPageLayout className="home-shell container mx-auto px-4 sm:px-6 lg:px-8">
      {slides.length > 0 && (
        <motion.section
          className="home-hero"
          variants={getAnimationVariant(heroAnimations.section)}
          initial="initial"
          animate="animate"
        >
          <div className="section-head">
            <h2 className="section-title">Noticias destacadas</h2>
          </div>
          <div className="home-top">
            <div className="carousel">
              <div
                className="slides"
                style={{ transform: `translateX(-${current * 100}%)` }}
              >
                {slides.map((s) => (
                  <Link key={s.id} className="slide" to={`/noticia/${s.id}`}>
                    {s.imagen ? (
                      <LazyImage
                        src={s.imagen}
                        alt={s.titulo || "Noticia destacada"}
                        className="featured-img"
                        threshold={0.1}
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
              <h3 className="aside-h">Recientes</h3>
              <ul className="aside-list">
                {recent.map((n) => (
                  <li key={n.id}>
                    <Link to={`/noticia/${n.id}`} className="aside-item">
                      <div
                        className={"aside-thumb" + (n.imagen ? "" : " blank")}
                      >
                        {n.imagen && (
                          <LazyImage
                            src={n.imagen}
                            alt=""
                            className="aside-thumb-img"
                            threshold={0.2}
                          />
                        )}
                      </div>
                      <div className="aside-info">
                        <p className="aside-title">
                          {n.titulo || "Sin título"}
                        </p>
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
        </motion.section>
      )}

      <section className="home-section py-4 sm:py-6 md:py-10">
        <div className="section-head">
          <h2 className="section-title text-xl sm:text-2xl md:text-3xl">
            Más noticias
          </h2>
          <div
            className="pills"
            role="tablist"
            aria-label="Filtrar por categoría"
          >
            {allCategories.map((c) => (
              <button
                key={c}
                type="button"
                className={`pill${homeCat === c ? " active" : ""}`}
                aria-pressed={homeCat === c}
                onClick={() => setHomeCat(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <motion.div
          className="home-grid-cards"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {baseGrid
            .filter((n) => homeCat === "Todas" || n.categoria === homeCat)
            .slice(0, 9)
            .map((n) => (
              <motion.article
                key={n.id}
                className="card-wrap"
                variants={cardAnimations}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.2 }}
              >
                <NewsCard news={n} />
              </motion.article>
            ))}
          {baseGrid.filter(
            (n) => homeCat === "Todas" || n.categoria === homeCat
          ).length === 0 && <p className="aside-empty">Sin datos</p>}
        </motion.div>
      </section>
    </AnimatedPageLayout>
  );
};

export default Home;
