import React from "react";
import { motion as Motion } from "framer-motion";
import "./Loader.css";

export default function Loader({
  fullscreen = false,
  message = "Cargando…",
  size = "md",
  className = "",
  ...rest
}) {
  const wrapClass = `${
    fullscreen ? "loader-overlay" : "loader-inline"
  } ${className}`.trim();
  const spinnerSizeClass =
    size === "lg" ? "spinner-lg" : size === "sm" ? "spinner-sm" : "spinner-md";

  return (
    <div className={wrapClass} role="status" aria-live="polite" {...rest}>
      <div className="loader-box">
        <Motion.span
          className={`spinner ${spinnerSizeClass}`}
          aria-hidden
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
        />
        {message && <span className="loader-text">{message}</span>}
      </div>
    </div>
  );
}
