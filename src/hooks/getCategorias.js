import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import db from "../FirebaseConfig/FirebaseConfig.js";

export function useCategoriesDocs() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const collections = ["categoria"];
    const unsubs = [];

    try {
      const buffers = new Map();
      collections.forEach((c) => buffers.set(c, []));

      collections.forEach((colName) => {
        const unsub = onSnapshot(
          collection(db, colName),
          (snap) => {
            if (!mounted) return;
            const arr = snap.docs.map((d) => {
              const data = d.data();
              const nombre =
                data?.Nombre || data?.nombre || data?.name || data?.title || "";
              return {
                id: d.id,
                Nombre: String(nombre).trim(),
                collection: colName,
              };
            });
            buffers.set(colName, arr);
            // merge y ordenar
            const merged = Array.from(buffers.values()).flat();
            merged.sort((a, b) => a.Nombre.localeCompare(b.Nombre, "es"));
            setDocs(merged);
            setLoading(false);
          },
          (err) => {
            console.error("Error leyendo ", colName, err);
            setError(err);
            setLoading(false);
          }
        );
        unsubs.push(unsub);
      });
    } catch (e) {
      console.error("Error configurando listeners de categorías", e);
      setError(e);
      setLoading(false);
    }

    return () => {
      unsubs.forEach((u) => u && u());
      mounted = false;
    };
  }, []);

  return { docs, loading, error };
}

// Hook de conveniencia: devuelve solo los nombres (strings)
export default function useCategoriesCollection(defaults = ["General"]) {
  const { docs, loading, error } = useCategoriesDocs();
  const categories = useMemo(() => {
    if (!docs || docs.length === 0) return defaults;
    const names = docs.map((d) => d.Nombre).filter(Boolean);
    return names.length ? Array.from(new Set(names)) : defaults;
  }, [docs, defaults]);
  return { categories, loading, error };
}
