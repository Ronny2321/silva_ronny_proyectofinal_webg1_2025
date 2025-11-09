import { supabase, IMAGE_BUCKET } from "./supabaseConfig.js";

/**
 * @param {File} file - Archivo de imagen a subir
 * @param {string} fileName - Nombre personalizado para el archivo (opcional)
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const uploadImage = async (file, fileName = null) => {
  try {
    if (!file || !file.type.startsWith("image/")) {
      return {
        success: false,
        error: "El archivo debe ser una imagen válida",
      };
    }

    const maxSize = 5 * 1024 * 1024; 
    if (file.size > maxSize) {
      return {
        success: false,
        error: "La imagen debe ser menor a 5MB",
      };
    }

    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const finalFileName =
      fileName || `news-image-${timestamp}.${fileExtension}`;

    const { data, error } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(finalFileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error subiendo imagen:", error);

      if (
        error.message.includes("row-level security policy") ||
        error.message.includes("new row violates")
      ) {
        return {
          success: false,
          error:
            'Permisos de storage no configurados. Ve a Supabase Dashboard → Storage → Policies y configura las políticas de acceso para el bucket "imagenew"',
        };
      }

      return {
        success: false,
        error: error.message || "Error al subir la imagen",
      };
    }

    const { data: urlData } = supabase.storage
      .from(IMAGE_BUCKET)
      .getPublicUrl(data.path);

    return {
      success: true,
      url: urlData.publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error("Error en uploadImage:", error);
    return {
      success: false,
      error: "Error inesperado al subir la imagen",
    };
  }
};

/**
 * @param {string} imagePath
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteImage = async (imagePath) => {
  try {
    const { error } = await supabase.storage
      .from(IMAGE_BUCKET)
      .remove([imagePath]);

    if (error) {
      console.error("Error eliminando imagen:", error);
      return {
        success: false,
        error: error.message || "Error al eliminar la imagen",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error en deleteImage:", error);
    return {
      success: false,
      error: "Error inesperado al eliminar la imagen",
    };
  }
};

/**
 * @returns {Promise<{success: boolean, images?: array, error?: string}>}
 */
export const listImages = async () => {
  try {
    const { data, error } = await supabase.storage.from(IMAGE_BUCKET).list("", {
      limit: 100,
      offset: 0,
    });

    if (error) {
      return {
        success: false,
        error: error.message || "Error al listar imágenes",
      };
    }

    return {
      success: true,
      images: data,
    };
  } catch (error) {
    console.error("Error en listImages:", error);
    return {
      success: false,
      error: "Error inesperado al listar imágenes",
    };
  }
};
