import React from "react";
import ReactDOM from "react-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { modalAnimations, getAnimationVariant } from "../../utils/animations";
import "./Modal.css";

const SIZE_MAP = {
  xs: 360,
  sm: 480,
  md: 640,
  lg: 768,
  xl: 896,
};

const Modal = ({
  open,
  title,
  onClose,
  actions,
  children,
  maxWidth = "md",
  primaryText,
  onPrimary,
  secondaryText,
  onSecondary,
  closeOnOverlay = true,
  rootClassName = "",
}) => {
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && open) onClose?.(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const width = SIZE_MAP[maxWidth] || SIZE_MAP.md;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {open && (
        <div
          className={"modal-root" + (rootClassName ? " " + rootClassName : "")}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className="modal-overlay"
            variants={getAnimationVariant(modalAnimations.overlay)}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={() => {
              if (closeOnOverlay) onClose?.(false);
            }}
          />
          <div className="modal-container">
            <motion.div
              className="modal-panel"
              style={{ maxWidth: width }}
              variants={getAnimationVariant(modalAnimations.content)}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <button
                className="modal-close"
                aria-label="Cerrar"
                onClick={() => onClose?.(false)}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              {title ? <h3 className="modal-title">{title}</h3> : null}
              <div className="modal-body">{children}</div>

              <div className="modal-footer">
                {actions ? (
                  actions
                ) : (
                  <>
                    {secondaryText && (
                      <button className="btn btn-outline" onClick={onSecondary}>
                        {secondaryText}
                      </button>
                    )}
                    {primaryText && (
                      <button className="btn btn-primary" onClick={onPrimary}>
                        {primaryText}
                      </button>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
