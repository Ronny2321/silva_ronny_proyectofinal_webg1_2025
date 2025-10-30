import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "../FirebaseConfig/FirebaseConfig.js";

/**
 * Hook para obtener categorías desde una colección de Firestore.
 * Intenta en orden: "categorias", "categoria", "Categorias".
 * Acepta campos de nombre: Nombre | nombre | name | title
 */
export default function useCategoriesCollection(defaults = ["General"]) {
  const [categories, setCategories] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const candidates = ["categorias", "categoria", "Categorias"];
        for (const c of candidates) {
          const snap = await getDocs(collection(db, c));
          if (!snap.empty) {
            const names = snap.docs
              .map((d) => d.data())
              .map((x) => x?.Nombre || x?.nombre || x?.name || x?.title)
              .filter(Boolean)
              .map((s) => String(s).trim());
            if (names.length) {
              const unique = Array.from(new Set(names));
              if (mounted) setCategories(unique);
              break;
            }
          }
        }
      } catch (e) {
        console.error("Error cargando categorías", e);
        if (mounted) setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { categories, loading, error };
}
