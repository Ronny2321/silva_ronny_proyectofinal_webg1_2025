import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { auth } from "../../FirebaseConfig/FirebaseConfig";
import { signOut } from "firebase/auth";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

const Nav = ({ user, role }) => {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Button color="inherit" component={RouterLink} to="/home">Inicio</Button>
      {user ? (
        <>
          <Button color="inherit" component={RouterLink} to="/">Noticias</Button>
          {role === "Reportero" && (
            <>
              <Button color="inherit" component={RouterLink} to="/crear">Crear</Button>
              <Button color="inherit" component={RouterLink} to="/categorias">Categorías</Button>
            </>
          )}
          <Button variant="outlined" color="inherit" onClick={() => signOut(auth)}>
            Cerrar sesión
          </Button>
        </>
      ) : (
        <>
          <Button color="inherit" component={RouterLink} to="/login">Iniciar sesión</Button>
          <Button color="inherit" component={RouterLink} to="/register">Crear cuenta</Button>
        </>
      )}
    </Stack>
  );
};

export default Nav;
