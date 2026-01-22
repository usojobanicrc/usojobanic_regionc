// src/utils/logActivity.js
import { supabase } from "./supabaseClient";

// Registrar acción en bitácora
export const logActivity = async (usuario_id, actividad, tabla, linea_id = null) => {
  try {
    const { error } = await supabase.from("bitacora").insert({
      usuario_id,
      actividad,
      tabla_afectada: tabla,
      linea_id,
    });

    if (error) console.error("Error registrando bitácora:", error);
  } catch (err) {
    console.error("Error inesperado al registrar actividad:", err);
  }
};