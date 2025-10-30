import React from "react";
import ReactDOM from "react-dom";
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
}) => {
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && open) onClose?.(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const width = SIZE_MAP[maxWidth] || SIZE_MAP.md;

  return ReactDOM.createPortal(
    <div className="modal-root" role="dialog" aria-modal="true">
      <div
        className="modal-overlay"
        onClick={() => {
          if (closeOnOverlay) onClose?.(false);
        }}
      />
      <div className="modal-container">
        <div className="modal-panel" style={{ maxWidth: width }}>
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
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
