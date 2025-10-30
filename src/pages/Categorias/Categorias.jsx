import React, { useMemo, useState } from "react";
import db from "../../FirebaseConfig/FirebaseConfig.js";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useCategoriesDocs } from "../../hooks/getCategorias.js";
import "./Categorias.css";

export default function Categorias() {
  const { docs, loading } = useCategoriesDocs();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [confirm, setConfirm] = useState({ open: false, id: null, name: "" });
  const [notice, setNotice] = useState({ open: false, title: "", text: "" });

  const canAdd = useMemo(() => newName.trim().length > 0, [newName]);
  const canSaveEdit = useMemo(
    () => editingName.trim().length > 0 && !!editingId,
    [editingName, editingId]
  );

  const handleAdd = async () => {
    const name = newName.trim();
    if (!name) return;
    try {
      await addDoc(collection(db, "categoria"), { Nombre: name });
      setNewName("");
      setNotice({
        open: true,
        title: "Categoría creada",
        text: `Se creó "${name}" correctamente.`,
      });
    } catch (e) {
      console.error("No se pudo agregar la categoría", e);
      alert("Error agregando la categoría");
    }
  };

  const startEdit = (it) => {
    setEditingId(it.id);
    setEditingName(it.Nombre);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const saveEdit = async () => {
    if (!canSaveEdit) return;
    try {
      const current = docs.find((d) => d.id === editingId);
      if (!current) return;
      const newValue = editingName.trim();
      await updateDoc(doc(db, current.collection, editingId), {
        Nombre: newValue,
      });
      setNotice({
        open: true,
        title: "Categoría actualizada",
        text: `Se actualizó a "${newValue}" correctamente.`,
      });
      cancelEdit();
    } catch (e) {
      console.error("No se pudo editar la categoría", e);
      alert("Error editando la categoría");
    }
  };

  const removeItem = async (id) => {
    try {
      const current = docs.find((d) => d.id === id);
      if (!current) return;
      await deleteDoc(doc(db, current.collection, id));
    } catch (e) {
      console.error("No se pudo eliminar la categoría", e);
      alert("Error eliminando la categoría");
    }
  };

  const askRemove = (it) =>
    setConfirm({ open: true, id: it.id, name: it.Nombre });
  const closeModal = () => setConfirm({ open: false, id: null, name: "" });
  const confirmRemove = async () => {
    if (!confirm.id) return;
    const deletedName = confirm.name;
    await removeItem(confirm.id);
    closeModal();
    setNotice({
      open: true,
      title: "Categoría eliminada",
      text: `Se eliminó "${deletedName}" correctamente.`,
    });
  };

  return (
    <div className="page-categorias">
      <section
        className="cat-card appear"
        role="region"
        aria-labelledby="cat-title"
      >
        <h2 id="cat-title" className="cat-title">
          Categorías
        </h2>
        <p className="cat-sub">
          Gestiona las categorías de tus noticias. Crea, edita o elimina de
          forma sencilla.
        </p>

        <div className="add-row">
          <label className="field" aria-label="Nueva categoría">
            <span className="icon" aria-hidden>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 7l-8 6-8-6" />
                <rect x="3" y="7" width="18" height="13" rx="2" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Nueva categoría"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canAdd) handleAdd();
              }}
            />
          </label>
          <button className="btn-pill" onClick={handleAdd} disabled={!canAdd}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Agregar
          </button>
        </div>

        {loading ? (
          <p className="cat-sub">Cargando…</p>
        ) : docs.length === 0 ? (
          <div className="empty" role="status">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 9h18" />
            </svg>
            <p style={{ marginTop: 8 }}>
              No hay categorías todavía. Crea la primera con el campo superior.
            </p>
          </div>
        ) : (
          <div className="table" role="table" aria-label="Lista de categorías">
            <div className="thead" role="rowgroup">
              <div role="row" className="row">
                <div role="columnheader">Nombre</div>
                <div role="columnheader" style={{ textAlign: "right" }}>
                  Acciones
                </div>
              </div>
            </div>
            <div role="rowgroup">
              {docs.map((it) => (
                <div key={it.id} role="row" className="row">
                  {editingId === it.id ? (
                    <div
                      className="edit-row"
                      style={{ gridColumn: "1 / span 2" }}
                    >
                      <label className="field" style={{ margin: 0 }}>
                        <span className="icon" aria-hidden>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 7l-8 6-8-6" />
                            <rect x="3" y="7" width="18" height="13" rx="2" />
                          </svg>
                        </span>
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                        />
                      </label>
                      <div className="edit-actions">
                        <button
                          className="btn-pill"
                          onClick={saveEdit}
                          disabled={!canSaveEdit}
                        >
                          Guardar
                        </button>
                        <button className="btn-muted" onClick={cancelEdit}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="name" role="cell">
                        {it.Nombre}
                      </div>
                      <div className="actions" role="cell">
                        <button
                          className="icon-btn"
                          title="Editar"
                          onClick={() => startEdit(it)}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden
                          >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                          </svg>
                        </button>
                        <button
                          className="icon-btn warning"
                          title="Eliminar"
                          onClick={() => askRemove(it)}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {confirm.open && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="del-title"
        >
          <div className="modal-card">
            <h3 id="del-title" className="modal-title">
              Eliminar categoría
            </h3>
            <p className="modal-text">
              ¿Seguro que deseas eliminar "{confirm.name}"? Esta acción no se
              puede deshacer.
            </p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={closeModal}>
                Cancelar
              </button>
              <button className="btn-danger" onClick={confirmRemove}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {notice.open && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ok-title"
        >
          <div className="modal-card">
            <div className="modal-icon success" aria-hidden>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h3 id="ok-title" className="modal-title">
              {notice.title}
            </h3>
            <p className="modal-text">{notice.text}</p>
            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={() => setNotice({ open: false, title: "", text: "" })}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
