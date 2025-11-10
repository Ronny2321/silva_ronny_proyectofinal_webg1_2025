import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { getAnimationVariant } from "../../../utils/animations";

const buildVariants = (type) => {
  const isPrimary = type === "primary";
  return {
    rest: {
      scale: 1,
      y: 0,
      boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
      backgroundColor: isPrimary ? "#2563eb" : undefined,
      transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    hover: {
      scale: 1.1,
      y: -2,
      boxShadow: "0 10px 28px rgba(0,0,0,0.22)",
      backgroundColor: isPrimary ? "#1d4ed8" : undefined,
      transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    tap: {
      scale: 0.96,
      y: 0,
      boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
      backgroundColor: isPrimary ? "#1e40af" : undefined,
      transition: { duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    loading: {
      scale: 1,
      y: 0,
      opacity: 0.7,
      boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
      backgroundColor: isPrimary ? "#2563eb" : undefined,
      transition: { duration: 0.25 },
    },
    disabled: {
      scale: 1,
      y: 0,
      opacity: 0.6,
      boxShadow: "none",
      backgroundColor: isPrimary ? "#2563eb" : undefined,
      transition: { duration: 0.25 },
    },
  };
};

const AnimatedButton = ({
  children,
  className = "",
  variant = "primary",
  isLoading = false,
  disabled = false,
  onClick,
  ...props
}) => {
  const baseClasses = {
    primary: "btn-primary",
    outline: "btn-outline",
    ghost: "btn-ghost",
  };

  const variants = buildVariants(variant);

  return (
    <motion.button
      className={`animated-button ${baseClasses[variant]} ${className}`}
      variants={getAnimationVariant(variants)}
      initial="rest"
      animate={isLoading ? "loading" : disabled ? "disabled" : "rest"}
      whileHover={!disabled && !isLoading ? "hover" : undefined}
      whileTap={!disabled && !isLoading ? "tap" : undefined}
      aria-busy={isLoading ? "true" : "false"}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <span className="loading-spinner">Cargando...</span>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default AnimatedButton;
