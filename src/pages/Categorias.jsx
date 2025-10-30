import React, { useEffect, useMemo, useState } from "react";
import db from "../FirebaseConfig/FirebaseConfig.js";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export default function Categorias() {
  const [items, setItems] = useState([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "categorias"), orderBy("Nombre"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => {
          const data = d.data();
          const nombre =
            data?.Nombre || data?.nombre || data?.name || data?.title || "";
          return { id: d.id, Nombre: String(nombre).trim() };
        });
        setItems(list);
        setLoading(false);
      },
      (err) => {
        console.error("Error leyendo categorias:", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const canAdd = useMemo(() => newName.trim().length > 0, [newName]);
  const canSaveEdit = useMemo(
    () => editingName.trim().length > 0 && !!editingId,
    [editingName, editingId]
  );

  const handleAdd = async () => {
    const name = newName.trim();
    if (!name) return;
    try {
      await addDoc(collection(db, "categorias"), { Nombre: name });
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
      await updateDoc(doc(db, "categorias", editingId), {
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
      await deleteDoc(doc(db, "categorias", id));
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
      ) : items.length === 0 ? (
        <p>No hay categorías</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, maxWidth: 480 }}>
          {items.map((it) => (
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
