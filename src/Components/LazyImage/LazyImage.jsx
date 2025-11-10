import React, { useEffect, useRef, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { getAnimationVariant } from "../../utils/animations";

const rawVariants = {
  loading: { opacity: 0, scale: 1.02 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  error: {
    opacity: 0.6,
    scale: 1,
    filter: "grayscale(100%)",
    transition: { duration: 0.3 },
  },
};

const LazyImage = ({
  src,
  alt,
  className = "",
  fallbackSrc = "/api/placeholder/400/300",
  threshold = 0.2,
  onLoad,
  onError,
  ...props
}) => {
  const [state, setState] = useState("loading");
  const [inView, setInView] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [threshold]);

  const handleLoad = (e) => {
    setState("visible");
    onLoad?.(e);
  };
  const handleError = (e) => {
    setState("error");
    onError?.(e);
  };

  const variants = getAnimationVariant(rawVariants, {
    loading: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    error: { opacity: 0.7 },
  });

  return (
    <motion.figure
      ref={containerRef}
      className={`lazy-image-container ${className}`}
      variants={variants}
      initial="loading"
      animate={state}
      aria-busy={state === "loading" ? "true" : "false"}
      {...props}
    >
      {inView ? (
        <img
          src={state === "error" ? fallbackSrc : src}
          alt={alt}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <div
          className="lazy-placeholder"
          style={{ width: "100%", height: "100%" }}
          aria-hidden
        />
      )}
    </motion.figure>
  );
};

export default LazyImage;
