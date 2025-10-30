import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: 3, mt: 4 }}>
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="body2">© {new Date().getFullYear()} Noticias UA — Todos los derechos reservados</Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>Hecho con React y Firebase</Typography>
      </Container>
    </Box>
  );
};

export default Footer;
