import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Nav from "../Nav/Nav.jsx";

const Header = ({ user, role }) => {
  return (
    <AppBar position="sticky" color="primary" elevation={4}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 800 }}>
            Noticias UA
          </Typography>
          <Nav user={user} role={role} />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
