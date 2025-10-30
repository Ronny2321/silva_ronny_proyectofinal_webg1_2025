import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../../FirebaseConfig/FirebaseConfig";
import { signOut } from "firebase/auth";
import "./Nav.css";

const Nav = ({ user, role }) => {
  return (
    <nav className="app-nav">
      <Link to="/home">Inicio</Link>
      {user ? (
        <>
          <Link to="/">Noticias</Link>
          {role === "Editor" ? (
            <Link to="/categorias">Categorías</Link>
          ) : (
            <Link to="/crear">Crear</Link>
          )}
          <button className="logout" onClick={() => signOut(auth)}>
            Cerrar sesión
          </button>
        </>
      ) : (
        <>
          <Link to="/login">Iniciar sesión</Link>
          <Link to="/register">Crear cuenta</Link>
        </>
      )}
    </nav>
  );
};

export default Nav;
