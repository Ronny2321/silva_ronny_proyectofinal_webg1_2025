import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const Modal = ({
  open,
  title,
  onClose,
  actions,
  children,
  maxWidth = "sm",
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => onClose?.(false)}
      fullWidth
      maxWidth={maxWidth}
    >
      {title ? <DialogTitle>{title}</DialogTitle> : null}
      <DialogContent dividers>{children}</DialogContent>
      {actions ? <DialogActions>{actions}</DialogActions> : null}
    </Dialog>
  );
};

export default Modal;
