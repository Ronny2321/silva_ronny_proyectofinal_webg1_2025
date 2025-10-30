import React from "react";
import "./Header.css";
import Nav from "../Nav/Nav.jsx";

const Header = ({ user, role }) => {
  return (
    <header>
      <h1>Noticias UA</h1>
      <Nav user={user} role={role} />
    </header>
  );
};

export default Header;
