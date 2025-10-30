import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { auth } from "../../FirebaseConfig/FirebaseConfig";
import { signOut } from "firebase/auth";

const Header = ({ user }) => {
  return (
    <header>
      <h1>Noticias UA</h1>
      <nav style={{ display: "flex", gap: 12 }}>
        <Link to="/home">Inicio</Link>
        {!user ? (
          <>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/register">Crear cuenta</Link>
          </>
        ) : (
          <button onClick={() => signOut(auth)}>Cerrar sesión</button>
        )}
      </nav>
    </header>
  );
};

export default Header;
