export const easeConfig = {
  ease: [0.25, 0.46, 0.45, 0.94],
  duration: 0.3,
};

export const springConfig = {
  type: "spring",
  damping: 25,
  stiffness: 300,
};

export const navAnimations = {
  mobileMenu: {
    initial: { x: "-100%", opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.3,
      },
    },
    exit: {
      x: "-100%",
      opacity: 0,
      transition: {
        ...easeConfig,
        duration: 0.25,
      },
    },
  },

  mobileOverlay: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        ...easeConfig,
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        ...easeConfig,
        duration: 0.2,
      },
    },
  },

  menuStagger: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  },

  menuItem: {
    initial: { x: 30, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        ...easeConfig,
        duration: 0.3,
      },
    },
    exit: {
      x: 30,
      opacity: 0,
      transition: {
        ...easeConfig,
        duration: 0.15,
      },
    },
  },

  desktopLink: {
    hover: {
      scale: 1.05,
      transition: {
        ...easeConfig,
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.98,
    },
  },

  button: {
    hover: {
      scale: 1.02,
      transition: {
        ...easeConfig,
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.98,
    },
  },

  avatar: {
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 400,
      },
    },
    tap: {
      scale: 0.95,
    },
  },
};

export const pageTransitions = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      ...easeConfig,
      duration: 0.45,
    },
  },
  exit: {
    opacity: 0,
    y: -15,
    transition: {
      ...easeConfig,
      duration: 0.3,
    },
  },
};

export const pageSection = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { ...easeConfig, duration: 0.5 },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { ...easeConfig, duration: 0.25 },
  },
};

export const pageSectionTop = {
  initial: { opacity: 0, y: -30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { ...easeConfig, duration: 0.5 },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: { ...easeConfig, duration: 0.25 },
  },
};

export const heroAnimations = {
  section: {
    initial: { opacity: 0, scale: 0.98 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        ...easeConfig,
        duration: 0.5,
      },
    },
  },
};

export const footerAnimations = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      ...easeConfig,
      duration: 0.4,
    },
  },
};

export const categoryAnimations = {
  item: {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        ...easeConfig,
        duration: 0.35,
      },
    },
  },
};

export const cardAnimations = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...easeConfig,
      duration: 0.4,
    },
  },
  hover: {
    scale: 1.05,
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10)",
    transition: {
      ...easeConfig,
      duration: 0.3,
    },
  },
  tap: {
    scale: 0.98,
  },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const modalAnimations = {
  overlay: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        ...easeConfig,
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        ...easeConfig,
        duration: 0.2,
      },
    },
  },
  content: {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 400,
        duration: 0.4,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        ...easeConfig,
        duration: 0.3,
      },
    },
  },
};

export const formAnimations = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      ...easeConfig,
      duration: 0.3,
    },
  },
};

// Animación específica para el contenido del detalle de noticia
// Entrada: y: 50 -> 0 y opacidad: 0 -> 1 (mobile-first)
export const newsDetailAnimations = {
  initial: { opacity: 0, y: 50 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { ...easeConfig, duration: 0.45 },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: { ...easeConfig, duration: 0.25 },
  },
};

export const mobileOptimized = {
  reducedMotion: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.15 },
    },
  },
};

export const prefersReducedMotion = () => {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export const getAnimationVariant = (
  defaultVariant,
  reducedVariant = mobileOptimized.reducedMotion
) => {
  return prefersReducedMotion() ? reducedVariant : defaultVariant;
};
