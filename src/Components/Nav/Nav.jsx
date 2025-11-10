import React from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "../../FirebaseConfig/FirebaseConfig";
import { signOut } from "firebase/auth";
import { navAnimations, getAnimationVariant } from "../../utils/animations";
import Loader from "../Loader/Loader.jsx";
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
  const [loggingOut, setLoggingOut] = React.useState(false);
  const initial = (user?.displayName || user?.email || "?")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <header className="news-nav fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <div className="nav-container container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="brand">
          <Link to="/home" className="brand-link" aria-label="Ir al inicio">
            <span className="brand-badge">UDLA</span>
            <span className="brand-name">Noticias UDLA</span>
          </Link>
        </div>

        <nav
          className="menu menu-desktop hidden md:flex gap-6"
          aria-label="Secciones"
        >
          <motion.div
            variants={getAnimationVariant(navAnimations.desktopLink)}
            whileHover="hover"
            whileTap="tap"
          >
            <Link
              className={`menu-link ${isActive("/home") ? "active" : ""}`}
              to="/home"
            >
              Noticias
            </Link>
          </motion.div>
          <motion.div
            variants={getAnimationVariant(navAnimations.desktopLink)}
            whileHover="hover"
            whileTap="tap"
          >
            <Link
              className={`menu-link ${isActive("/") ? "active" : ""}`}
              to="/"
            >
              Mis Noticias
            </Link>
          </motion.div>
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
                    <motion.div
                      variants={getAnimationVariant(navAnimations.button)}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Link className="small-link" to="/crear">
                        Crear noticia
                      </Link>
                    </motion.div>
                    <motion.div
                      variants={getAnimationVariant(navAnimations.button)}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Link className="small-link" to="/categorias">
                        Categorías
                      </Link>
                    </motion.div>
                  </div>
                )}
                <motion.div
                  className="avatar"
                  title={user?.email || "Usuario"}
                  variants={getAnimationVariant(navAnimations.avatar)}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {initial}
                </motion.div>
                <motion.button
                  className="btn-outline"
                  onClick={async () => {
                    try {
                      setLoggingOut(true);
                      await signOut(auth);
                    } finally {
                      setLoggingOut(false);
                    }
                  }}
                  variants={getAnimationVariant(navAnimations.button)}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Cerrar sesión
                </motion.button>
              </div>
            ) : (
              <div className="guest-area">
                <motion.div
                  variants={getAnimationVariant(navAnimations.button)}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link className="btn-primary" to="/login">
                    Iniciar sesión
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                className="mobile-overlay"
                onClick={() => setOpen(false)}
                variants={getAnimationVariant(navAnimations.mobileOverlay)}
                initial="initial"
                animate="animate"
                exit="exit"
              />
              <motion.aside
                id="mobile-menu"
                className="mobile-panel"
                aria-hidden={!open}
                role="dialog"
                aria-modal={open}
                variants={getAnimationVariant(navAnimations.mobileMenu)}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <motion.nav
                  className="mobile-menu flex flex-col space-y-4 p-4 text-lg font-semibold"
                  aria-label="Menú móvil"
                  variants={navAnimations.menuStagger}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <motion.div variants={navAnimations.menuItem}>
                    <Link
                      className="mobile-link"
                      to="/home"
                      onClick={() => setOpen(false)}
                    >
                      Noticias
                    </Link>
                  </motion.div>
                  <motion.div variants={navAnimations.menuItem}>
                    <Link
                      className="mobile-link"
                      to="/"
                      onClick={() => setOpen(false)}
                    >
                      Mis Noticias
                    </Link>
                  </motion.div>
                  <motion.hr
                    className="mobile-sep"
                    variants={navAnimations.menuItem}
                  />
                  {user ? (
                    <>
                      {role === "Reportero" && (
                        <>
                          <motion.div variants={navAnimations.menuItem}>
                            <Link
                              className="mobile-link"
                              to="/crear"
                              onClick={() => setOpen(false)}
                            >
                              Crear
                            </Link>
                          </motion.div>
                          <motion.div variants={navAnimations.menuItem}>
                            <Link
                              className="mobile-link"
                              to="/categorias"
                              onClick={() => setOpen(false)}
                            >
                              Categorías
                            </Link>
                          </motion.div>
                          <motion.hr
                            className="mobile-sep"
                            variants={navAnimations.menuItem}
                          />
                        </>
                      )}
                      <motion.button
                        className="mobile-logout"
                        onClick={async () => {
                          setOpen(false);
                          try {
                            setLoggingOut(true);
                            await signOut(auth);
                          } finally {
                            setLoggingOut(false);
                          }
                        }}
                        variants={navAnimations.menuItem}
                      >
                        Cerrar sesión
                      </motion.button>
                    </>
                  ) : (
                    <motion.div variants={navAnimations.menuItem}>
                      <Link
                        className="mobile-login"
                        to="/login"
                        onClick={() => setOpen(false)}
                      >
                        Iniciar sesión
                      </Link>
                    </motion.div>
                  )}
                </motion.nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
      {loggingOut && <Loader fullscreen message="Cerrando sesión…" />}
    </header>
  );
};

export default Nav;
