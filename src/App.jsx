import "./App.css";
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import theme from "./theme";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./Components/Header/Header.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import db, { auth } from "./FirebaseConfig/FirebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";
import News from "./pages/News/News.jsx";
import CreateNews from "./pages/CreateNews/CreateNews.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import Home from "./pages/Home/Home.jsx";
import Categorias from "./pages/Categorias/Categorias.jsx";
import NewsDetail from "./pages/NewsDetail/NewsDetail.jsx";

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Header user={usuario} role={role} />
        <Box component="main" sx={{ minHeight: "calc(100vh - 160px)", py: 3 }}>
          <Container maxWidth="lg">
            <Routes>
              <Route path="/inicio" element={<Home />} />
              <Route
                path="/login"
                element={usuario ? <Navigate to="/" replace /> : <Login />}
              />
              <Route path="/home" element={<Home />} />
              <Route path="/noticia/:id" element={<NewsDetail />} />
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
          </Container>
        </Box>
        <Footer role={role} />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
