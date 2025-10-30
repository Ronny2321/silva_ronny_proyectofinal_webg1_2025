import React, { useMemo, useState } from "react";
import db from "../FirebaseConfig/FirebaseConfig.js";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useCategoriesDocs } from "../hooks/getCategorias.js";

export default function Categorias() {
  const { docs, loading } = useCategoriesDocs(); 
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

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
      await updateDoc(doc(db, current.collection, editingId), {
        Nombre: editingName.trim(),
      });
      cancelEdit();
    } catch (e) {
      console.error("No se pudo editar la categoría", e);
      alert("Error editando la categoría");
    }
  };

  const removeItem = async (id) => {
    if (!window.confirm("¿Eliminar esta categoría?")) return;
    try {
      const current = docs.find((d) => d.id === id);
      if (!current) return;
      await deleteDoc(doc(db, current.collection, id));
    } catch (e) {
      console.error("No se pudo eliminar la categoría", e);
      alert("Error eliminando la categoría");
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Categorías</h2>
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <input
          type="text"
          placeholder="Nueva categoría"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button onClick={handleAdd} disabled={!canAdd}>
          Agregar
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : docs.length === 0 ? (
        <p>No hay categorías</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, maxWidth: 480 }}>
          {docs.map((it) => (
            <li
              key={it.id}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              {editingId === it.id ? (
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button onClick={saveEdit} disabled={!canSaveEdit}>
                    Guardar
                  </button>
                  <button onClick={cancelEdit}>Cancelar</button>
                </>
              ) : (
                <>
                  <span style={{ flex: 1 }}>{it.Nombre}</span>
                  <button onClick={() => startEdit(it)}>Editar</button>
                  <button onClick={() => removeItem(it.id)}>Eliminar</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
