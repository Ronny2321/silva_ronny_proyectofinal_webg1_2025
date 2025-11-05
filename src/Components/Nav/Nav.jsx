import React from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { auth } from "../../FirebaseConfig/FirebaseConfig";
import { signOut } from "firebase/auth";
import "./Nav.css";

const Nav = ({ user, role }) => {
  const { pathname } = useLocation();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => document.body.classList.remove("no-scroll");
  }, [open]);

  const isActive = (to) => pathname === to;
  const initial = (user?.displayName || user?.email || "?")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <header className="news-nav sticky top-0 z-50 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <div className="nav-container container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="brand">
          <Link to="/home" className="brand-link" aria-label="Ir al inicio">
            <span className="brand-badge">UA</span>
            <span className="brand-name">Noticias UA</span>
          </Link>
        </div>

        <nav
          className="menu menu-desktop hidden md:flex gap-6"
          aria-label="Secciones"
        >
          <Link
            className={`menu-link ${isActive("/home") ? "active" : ""}`}
            to="/home"
          >
            Inicio
          </Link>
          <Link className={`menu-link ${isActive("/") ? "active" : ""}`} to="/">
            Noticias
          </Link>
        </nav>

        <div className="actions flex items-center gap-3">
          <button
            className={`hamburger ${open ? "is-open" : ""} md:hidden`}
            aria-label="Abrir menú"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>

          <div className="actions-desktop hidden md:inline-flex items-center gap-3">
            {user ? (
              <div className="user-area">
                {role === "Reportero" && (
                  <div className="reporter-links">
                    <Link className="small-link" to="/crear">
                      Crear noticia
                    </Link>
                    <Link className="small-link" to="/categorias">
                      Categorías
                    </Link>
                  </div>
                )}
                <div className="avatar" title={user?.email || "Usuario"}>
                  {initial}
                </div>
                <button className="btn-outline" onClick={() => signOut(auth)}>
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="guest-area">
                <Link className="btn-primary" to="/login">
                  Iniciar sesión
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {createPortal(
        <>
          <div
            className={`mobile-overlay ${open ? "show" : ""}`}
            onClick={() => setOpen(false)}
          />
          <aside
            id="mobile-menu"
            className={`mobile-panel ${open ? "show" : ""}`}
            aria-hidden={!open}
            role="dialog"
            aria-modal={open}
          >
            <nav
              className="mobile-menu flex flex-col space-y-4 p-4 text-lg font-semibold"
              aria-label="Menú móvil"
            >
              <Link
                className="mobile-link"
                to="/home"
                onClick={() => setOpen(false)}
              >
                Inicio
              </Link>
              <Link
                className="mobile-link"
                to="/"
                onClick={() => setOpen(false)}
              >
                Noticias
              </Link>
              <hr className="mobile-sep" />
              {user ? (
                <>
                  {role === "Reportero" && (
                    <>
                      <Link
                        className="mobile-link"
                        to="/crear"
                        onClick={() => setOpen(false)}
                      >
                        Crear
                      </Link>
                      <Link
                        className="mobile-link"
                        to="/categorias"
                        onClick={() => setOpen(false)}
                      >
                        Categorías
                      </Link>
                      <hr className="mobile-sep" />
                    </>
                  )}
                  <button
                    className="mobile-logout"
                    onClick={() => {
                      setOpen(false);
                      signOut(auth);
                    }}
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <Link
                  className="mobile-login"
                  to="/login"
                  onClick={() => setOpen(false)}
                >
                  Iniciar sesión
                </Link>
              )}
            </nav>
          </aside>
        </>,
        document.body
      )}
    </header>
  );
};

export default Nav;
