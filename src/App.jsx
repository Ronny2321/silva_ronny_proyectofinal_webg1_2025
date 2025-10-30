import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./Components/Header/Header.jsx";
import News from "./Components/News/News.jsx";
import NewsForm from "./Components/NewsForm/NewsForm.jsx";
import db, { auth } from "./FirebaseConfig/FirebaseConfig.js";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";

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
          if (!snap.exists()) {
            await setDoc(ref, {
              email: u.email,
              role: "Reportero",
              createdAt: serverTimestamp(),
            });
            setRole("Reportero");
          } else {
            const data = snap.data();
            setRole(data.role || "Reportero");
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
                <NewsForm user={usuario} role={role} />
              </>
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
