import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../FirebaseConfig/FirebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import AnimatedPageLayout from "../../Components/AnimatedPageLayout/AnimatedPageLayout.jsx";
import { formAnimations, getAnimationVariant } from "../../utils/animations.js";
import "./Login.css";

const translate = (code) => {
  const map = {
    "auth/invalid-email": "El correo no es válido.",
    "auth/user-disabled": "La cuenta está deshabilitada.",
    "auth/user-not-found": "No existe una cuenta con este correo.",
    "auth/wrong-password": "La contraseña es incorrecta.",
    "auth/missing-password": "Ingresa tu contraseña.",
    "auth/too-many-requests": "Demasiados intentos. Inténtalo más tarde.",
    "auth/invalid-credential": "Credenciales inválidas.",
    "auth/network-request-failed": "Error de red. Revisa tu conexión.",
    "auth/operation-not-allowed": "Operación no permitida.",
  };
  return map[code];
};

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) navigate("/", { replace: true });
    });
    return () => unsub();
  }, [navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      if (!email || !password) {
        throw { code: "auth/missing-password" };
      }
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/", { replace: true });
    } catch (e) {
      setErr(translate(e.code) || "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPageLayout className="login-screen">
      <div className="bg-texture" aria-hidden />
      <section className="login-card appear">
        <div className="card-header">
          <div className="logo">UDLA</div>
          <h1>Bienvenido</h1>
          <p className="sub">Accede a tu cuenta para gestionar tus noticias.</p>
        </div>

        <Motion.form
          className="form"
          onSubmit={onSubmit}
          noValidate
          variants={getAnimationVariant(formAnimations)}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <label className="field">
            <span className="icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M4 8l8 5 8-5" />
                <rect x="4" y="4" width="16" height="16" rx="2" />
              </svg>
            </span>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label className="field">
            <span className="icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {err && (
            <div className="error" role="alert">
              {err}
            </div>
          )}

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? (
              <span className="btn-content">
                <svg
                  className="spin"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <circle cx="12" cy="12" r="10" opacity="0.25" />
                  <path d="M22 12a10 10 0 0 1-10 10" />
                </svg>
                Entrando…
              </span>
            ) : (
              <span className="btn-content">Entrar</span>
            )}
          </button>
        </Motion.form>

        <p className="hint">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </section>
    </AnimatedPageLayout>
  );
};

export default Login;
