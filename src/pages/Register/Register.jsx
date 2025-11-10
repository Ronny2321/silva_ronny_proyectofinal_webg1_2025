import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import db, { auth } from "../../FirebaseConfig/FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import AnimatedPageLayout from "../../Components/AnimatedPageLayout/AnimatedPageLayout.jsx";
import { formAnimations, getAnimationVariant } from "../../utils/animations.js";
import "./Register.css";

const translate = (code) => {
  const map = {
    "auth/invalid-email": "El correo no es válido.",
    "auth/email-already-in-use": "Ya existe una cuenta con este correo.",
    "auth/weak-password": "La contraseña es muy débil (mínimo 6 caracteres).",
    "auth/operation-not-allowed": "Operación no permitida.",
    "auth/network-request-failed": "Error de red. Revisa tu conexión.",
  };
  return map[code];
};

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("Reportero");
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState("");
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) navigate("/", { replace: true });
    });
    return () => unsub();
  }, [navigate]);

  const isEmailValid = (v) => /.+@.+\..+/.test(v);
  const isPassStrong = (v) => typeof v === "string" && v.length >= 6;
  const isConfirmOk = (p, c) => p === c && c.length > 0;

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setSuccess("");
    if (!isEmailValid(email)) {
      setErr("Ingresa un correo válido.");
      return;
    }
    if (!isPassStrong(password)) {
      setErr("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (!isConfirmOk(password, confirm)) {
      setErr("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    try {
      const selectedRole = role === "Editor" ? "Editor" : "Reportero";
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), {
        email: cred.user.email,
        role: selectedRole,
        createdAt: serverTimestamp(),
      });
      setSuccess("Cuenta creada con éxito. Redirigiendo al inicio de sesión…");
      await signOut(auth);
      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (e) {
      setErr(translate(e.code) || "Error al crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPageLayout className="login-screen register-screen">
      <div className="bg-texture" aria-hidden />
      <section
        className="login-card appear"
        role="region"
        aria-labelledby="reg-title"
      >
        <div className="card-header">
          <div className="logo">UDLA</div>
          <h1 id="reg-title">Crear cuenta</h1>
          <p className="sub">
            Regístrate para publicar y gestionar tus noticias.
          </p>
        </div>

        {success && (
          <div className="banner-success" role="status">
            {success}
          </div>
        )}
        {err && (
          <div className="error" role="alert">
            {err}
          </div>
        )}

        <Motion.form
          className="form"
          onSubmit={onSubmit}
          noValidate
          variants={getAnimationVariant(formAnimations)}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <h3 className="group-title"> Rellene los siguientes campos: </h3>
          <div className="fields-grid">
            {/* Email */}
            <div className="field-group">
              <label
                className={`field ${
                  touched.email ? (isEmailValid(email) ? "ok" : "bad") : ""
                }`}
              >
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
                <span className="sr-only">Correo</span>
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  autoComplete="email"
                  required
                />
              </label>
              {touched.email && (
                <small
                  className={`hint-inline ${
                    isEmailValid(email) ? "ok" : "bad"
                  }`}
                >
                  {isEmailValid(email)
                    ? "Correo válido"
                    : "Formato de correo no válido"}
                </small>
              )}
            </div>
            {/* Password */}
            <div className="field-group">
              <label
                className={`field ${
                  touched.password
                    ? isPassStrong(password)
                      ? "ok"
                      : "bad"
                    : ""
                }`}
              >
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
                <span className="sr-only">Contraseña</span>
                <input
                  type="password"
                  placeholder="Contraseña (mín. 6 caracteres)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  autoComplete="new-password"
                  required
                />
              </label>
              {touched.password && (
                <small
                  className={`hint-inline ${
                    isPassStrong(password) ? "ok" : "bad"
                  }`}
                >
                  {isPassStrong(password)
                    ? "Contraseña segura"
                    : "Debe tener al menos 6 caracteres"}
                </small>
              )}
            </div>
            {/* Confirm Password */}
            <div className="field-group">
              <label
                className={`field ${
                  touched.confirm
                    ? isConfirmOk(password, confirm)
                      ? "ok"
                      : "bad"
                    : ""
                }`}
              >
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
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span className="sr-only">Confirmar contraseña</span>
                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                  autoComplete="new-password"
                  required
                />
              </label>
              {touched.confirm && (
                <small
                  className={`hint-inline ${
                    isConfirmOk(password, confirm) ? "ok" : "bad"
                  }`}
                >
                  {isConfirmOk(password, confirm)
                    ? "Coinciden"
                    : "No coinciden"}
                </small>
              )}
            </div>
            {/* Role select */}
            <div className="field-group">
              <label className="sr-only" htmlFor="role">
                Rol
              </label>
              <select
                id="role"
                className="select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Reportero">Reportero</option>
                <option value="Editor">Editor</option>
              </select>
            </div>
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Creando…" : "Registrarme"}
          </button>
        </Motion.form>

        <p className="hint">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </section>
    </AnimatedPageLayout>
  );
};

export default Register;
