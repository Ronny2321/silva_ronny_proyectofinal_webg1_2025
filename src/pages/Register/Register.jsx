import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import db, { auth } from "../../FirebaseConfig/FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

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
    if (password !== confirm) {
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
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (e) {
      setErr(translate(e.code) || "Error al crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 320, margin: "40px auto" }}>
      <h2>Crear cuenta</h2>
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
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <label style={{ display: "block", margin: "8px 0 4px" }}>Rol</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Reportero">Reportero</option>
          <option value="Editor">Editor</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Registrarme"}
        </button>
      </form>
      {err && <p style={{ color: "red" }}>{err}</p>}
      <p>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
};

export default Register;
