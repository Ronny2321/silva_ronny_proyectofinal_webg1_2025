import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#111111",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#6C63FF", 
    },
    background: {
      default: "#f6f7f9",
      paper: "#ffffff",
    },
    text: {
      primary: "#121212",
      secondary: "#555555",
    },
  },
  typography: {
    fontFamily: [
      "Inter",
      "system-ui",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "sans-serif",
    ].join(","),
    h1: { fontFamily: "Merriweather, Georgia, serif", fontWeight: 800 },
    h2: { fontFamily: "Merriweather, Georgia, serif", fontWeight: 800 },
    h3: { fontFamily: "Merriweather, Georgia, serif", fontWeight: 700 },
    h4: { fontFamily: "Merriweather, Georgia, serif", fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

export default theme;
