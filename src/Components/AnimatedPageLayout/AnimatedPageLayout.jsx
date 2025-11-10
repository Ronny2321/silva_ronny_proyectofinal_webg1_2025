import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { pageSectionTop, getAnimationVariant } from "../../utils/animations";

const AnimatedPageLayout = ({ children, className = "" }) => {
  return (
    <motion.section
      className={`animated-page ${className}`}
      variants={getAnimationVariant(pageSectionTop)}
      initial="initial"
      animate="animate"
      exit="exit"
      aria-live="polite"
    >
      {children}
    </motion.section>
  );
};

export default AnimatedPageLayout;
