import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./Components/Header/Header.jsx";
import News from "./Components/News/News.jsx";
import CreateNews from "./pages/CreateNews.jsx";
import db, { auth } from "./FirebaseConfig/FirebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import Categorias from "./pages/Categorias.jsx";

function App() {
  const [usuario, setUsuario] = React.useState(null);
  const [role, setRole] = React.useState(null);

  React.useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      setUsuario(u);
      if (u) {
        try {
          const ref = doc(db, "users", u.uid);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            const data = snap.data();
            setRole(data.role || "Reportero");
          } else {
            setRole("Reportero");
          }
        } catch (e) {
          console.error("Error cargando rol de usuario", e);
          setRole("Reportero");
        }
      } else {
        setRole(null);
      }
    });
    return () => unsub();
  }, []);

  return (
    <BrowserRouter>
      <Header user={usuario} role={role} />
      <Routes>
        <Route path="/inicio" element={<Home />} />
        <Route
          path="/login"
          element={usuario ? <Navigate to="/" replace /> : <Login />}
        />
        <Route path="/home" element={<Home />} />
        <Route
          path="/register"
          element={usuario ? <Navigate to="/" replace /> : <Register />}
        />
        <Route
          path="/"
          element={
            usuario ? (
              <>
                <News role={role} />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/crear"
          element={
            usuario ? (
              role === "Editor" ? (
                <Navigate to="/" replace />
              ) : (
                <CreateNews role={role} />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/categorias"
          element={
            usuario ? (
              role === "Reportero" ? (
                <Categorias />
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="*"
          element={<Navigate to={usuario ? "/" : "/home"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
