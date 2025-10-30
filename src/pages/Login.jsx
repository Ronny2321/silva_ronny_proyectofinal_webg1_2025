import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../FirebaseConfig/FirebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

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
    <div style={{ maxWidth: 320, margin: "40px auto" }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
      {err && <p style={{ color: "red" }}>{err}</p>}
      <p>
        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
      </p>
    </div>
  );
};

export default Login;
