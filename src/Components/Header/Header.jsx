import React from "react";
import { Link, useLocation } from "react-router-dom";
import Nav from "../Nav/Nav.jsx";
import "./Header.css";
import db from "../../FirebaseConfig/FirebaseConfig";
import { collection, getDocs, limit, query, where } from "firebase/firestore";

const Header = ({ user, role }) => {
  const { pathname } = useLocation();
  const showHero = pathname === "/home" || pathname === "/inicio";

  const [main, setMain] = React.useState(null);
  const [secondary, setSecondary] = React.useState([]);

  React.useEffect(() => {
    if (!showHero) return;
    let cancelled = false;
    const toMillis = (v) => {
      if (!v) return 0;
      try {
        if (typeof v === "string") return new Date(v).getTime() || 0;
        if (typeof v === "number") return v;
        if (v?.toDate) return v.toDate().getTime() || 0;
      } catch {
        /* noop */
      }
      return 0;
    };

    const load = async () => {
      try {
        const q = query(
          collection(db, "Noticias"),
          where("estado", "==", "Publicado"),
          limit(20)
        );
        const snap = await getDocs(q);
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        items.sort(
          (a, b) =>
            toMillis(b.fechaPublicacion || b.fecha || b.fechaCreacion) -
            toMillis(a.fechaPublicacion || a.fecha || a.fechaCreacion)
        );
        const [first, ...rest] = items;
        if (cancelled) return;
        setMain(first || null);
        setSecondary(rest.slice(0, 3));
      } catch (e) {
        console.error("Error cargando noticias para el hero", e);
      } finally {
        // if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [showHero]);

  return (
    <>
      <Nav user={user} role={role} />
      {showHero && main && (
        <section className="hero">
          <div className="container hero-grid">
            <article className="hero-main fade-up">
              <Link
                to={`/noticia/${main.id}`}
                className="hero-figure"
                aria-label={main.titulo || "Noticia destacada"}
              >
                {main.imagen && (
                  <img
                    src={main.imagen}
                    alt={main.titulo || "Noticia destacada"}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
                <div className="hero-overlay" />
                <div className="hero-content">
                  {main.categoria && (
                    <span className="chip">{main.categoria}</span>
                  )}
                  <h1 className="hero-title">{main.titulo || "Sin título"}</h1>
                  {main.subtitulo && (
                    <p className="hero-subtitle">{main.subtitulo}</p>
                  )}
                </div>
              </Link>
            </article>

            <aside className="hero-side">
              {secondary.map((n, idx) => (
                <Link
                  key={n.id}
                  to={`/noticia/${n.id}`}
                  className={`card-compact fade-up fade-delay-${idx + 1}`}
                >
                  <div className="card-media" aria-hidden>
                    {n.imagen && (
                      <img
                        src={n.imagen}
                        alt=""
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                  </div>
                  <div className="card-body">
                    {n.categoria && (
                      <span className="chip chip-sm">{n.categoria}</span>
                    )}
                    <h3 className="card-title">{n.titulo || "Sin título"}</h3>
                  </div>
                </Link>
              ))}
            </aside>
          </div>
        </section>
      )}
    </>
  );
};

export default Header;
