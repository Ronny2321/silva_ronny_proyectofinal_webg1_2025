import React from "react";
import { Link, useLocation } from "react-router-dom";
import { auth } from "../../FirebaseConfig/FirebaseConfig";
import { signOut } from "firebase/auth";
import "./Nav.css";

const Nav = ({ user, role }) => {
  const { pathname } = useLocation();
  const [open, setOpen] = React.useState(false);

  const isActive = (to) => pathname === to;
  const initial = (user?.displayName || user?.email || "?")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <header className="news-nav">
      <div className="nav-container">
        <div className="brand">
          <Link to="/home" className="brand-link" aria-label="Ir al inicio">
            <span className="brand-badge">UA</span>
            <span className="brand-name">Noticias UA</span>
          </Link>
        </div>

        <nav className="menu menu-desktop" aria-label="Secciones">
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

        <div className="actions">
          <button
            className={`hamburger ${open ? "is-open" : ""}`}
            aria-label="Abrir menú"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>

          <div className="actions-desktop">
            {user ? (
              <div className="user-area">
                {role === "Reportero" && (
                  <div className="reporter-links">
                    <Link className="small-link" to="/crear">
                      Crear
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

      <div
        className={`mobile-overlay ${open ? "show" : ""}`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`mobile-panel ${open ? "show" : ""}`}
        aria-hidden={!open}
      >
        <nav className="mobile-menu" aria-label="Menú móvil">
          <Link
            className="mobile-link"
            to="/home"
            onClick={() => setOpen(false)}
          >
            Inicio
          </Link>
          <Link className="mobile-link" to="/" onClick={() => setOpen(false)}>
            Noticias
          </Link>
          <a
            className="mobile-link"
            href="/home#tecnologia"
            onClick={() => setOpen(false)}
          >
            Tecnología
          </a>
          <a
            className="mobile-link"
            href="/home#deportes"
            onClick={() => setOpen(false)}
          >
            Deportes
          </a>
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
    </header>
  );
};

export default Nav;
