import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./Components/Header/Header.jsx";
import News from "./Components/News/News.jsx";
import NewsForm from "./Components/NewsForm/NewsForm.jsx";
import { auth } from "./FirebaseConfig/FirebaseConfig.js";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";

function App() {
  const [usuario, setUsuario] = React.useState(null);

  React.useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUsuario(u));
    return () => unsub();
  }, []);

  return (
    <BrowserRouter>
      <Header user={usuario} />
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
                <News />
                <NewsForm />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
  <Route path="*" element={<Navigate to={usuario ? "/" : "/home"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
