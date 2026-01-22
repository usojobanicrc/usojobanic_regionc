import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import Loader from "../components/Loader.jsx";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const [session, setSession] = useState(undefined);
  const [userRole, setUserRole] = useState(undefined);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      if (!data.session) {
        setUserRole(null);
        return;
      }

      const email = data.session.user.email;

      // Obtener id del usuario
      const { data: perfil } = await supabase
        .from("usuarios")
        .select("id")
        .eq("correo", email)
        .single();

      if (!perfil) {
        setUserRole(null);
        return;
      }

      // Obtener el rol desde usuarios_roles
      const { data: relacion } = await supabase
        .from("usuarios_roles")
        .select("roles(nombre_rol)")
        .eq("usuario_id", perfil.id)
        .single();

      // Normalizar a minúsculas
      const rol = relacion?.roles?.nombre_rol?.toLowerCase() ?? null;
      setUserRole(rol);
    };

    loadUser();
  }, []);

  // Esperando datos
  if (session === undefined || userRole === undefined)
    return <Loader />;

  // No hay sesión
  if (!session) return <Navigate to="/login" replace />;

  // NO tiene permiso
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
