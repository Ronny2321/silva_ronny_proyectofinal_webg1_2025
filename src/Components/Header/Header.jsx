import React from "react";
import Nav from "../Nav/Nav.jsx";
import "./Header.css";

const Header = ({ user, role }) => {
  return <Nav user={user} role={role} />;
};

export default Header;
