// src/pages/MiCuenta.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AccountProfileCard from "../components/AccountProfileCard";
import { FaAngleDown } from "react-icons/fa"; // Asegúrate de tener este ícono importado
import "../css/MiCuenta.css";
import { supabase } from "../utils/supabaseClient";
import { Footer } from "../components/Footer";

const MiCuenta = () => {
  // Estado para controlar qué sección está abierta.
  // Inicialmente, la sección de "Datos Personales" está abierta.
  const [openSections, setOpenSections] = useState({
    personales: false,
    configuracion: false,
    historial: false,
    usuarios: false,
  });

  // Función para alternar la visibilidad de una sección
  const toggleSection = (sectionName) => {
    setOpenSections((prevSections) => ({
      ...prevSections, // Mantiene el estado de las otras secciones
      [sectionName]: !prevSections[sectionName], // Invierte el estado de la sección clicada
    }));
  };

  const [userData, setUserData] = useState(null);

  // --- Cargar datos del usuario ---
  useEffect(() => {
    const loadUserData = async () => {
      // Usuario logueado
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) return;

      const correo = authData.user.email;

      //Traer datos básicos del usuario
      const { data: perfil } = await supabase
        .from("usuarios")
        .select("id, nombre, apellido, correo, telefono, fecha_nacimiento, foto_url")
        .eq("correo", correo)
        .single();

      if (!perfil) return;

      // 2️⃣ Traer su rol asignado
      const { data: relacion } = await supabase
        .from("usuarios_roles")
        .select("roles(nombre_rol)")
        .eq("usuario_id", perfil.id)
        .single();

      const rol = relacion?.roles?.nombre_rol ?? "Sin rol asignado";

      // 3️⃣ Guardar todo listo para usar en AccountProfileCard
      setUserData({
        ...perfil,
        rol_asignado: rol,
      });
    };

    loadUserData();
  }, []);

  return (
    <div>
      <main className="mi-cuenta-page">
        <div className="page-header-container">
          {/* Botón para volver al dashboard */}
          <Link to="/dashboard" className="back-btn">
            ← Volver
          </Link>
          <h1 className="page-title">Mi Cuenta</h1>
        </div>

        {/* Tarjeta de Perfil del Usuario */}
        <AccountProfileCard user={userData} />

        {/* Sección de Datos Personales */}
        <section className="account-section">
          <h2
            className="section-title"
            onClick={() => toggleSection("personales")}
          >
            DATOS PERSONALES
            <FaAngleDown
              className={`section-icon ${
                openSections.personales ? "open" : ""
              }`}
            />
          </h2>
          {/* La clase 'visible' se aplica si la sección está abierta */}
          <div
            className={`section-content ${
              openSections.personales ? "visible" : ""
            }`}
          >
            <div className="data-field">
              <span className="field-label">Nombre completo</span>
              <span className="field-value">
                {userData
                  ? `${userData.nombre} ${userData.apellido}`
                  : "Cargando..."}
              </span>
            </div>
            <div className="data-field">
              <span className="field-label">Correo electrónico</span>
              <span className="field-value">{userData?.correo}</span>
            </div>
            <div className="data-field">
              <span className="field-label">Número de celular</span>
              <span className="field-value">{userData?.telefono}</span>
            </div>
            <div className="data-field">
              <span className="field-label">Fecha de nacimiento</span>
              <span className="field-value">
                {userData?.fecha_nacimiento
                  ? new Date(userData.fecha_nacimiento).toLocaleDateString()
                  : ""}
              </span>
            </div>
          </div>
        </section>

        {/* Sección de Historial de Actividad (con la clase del div corregida) */}
        <section className="account-section">
          <h2
            className="section-title"
            onClick={() => toggleSection("historial")}
          >
            HISTORIAL DE ACTIVIDAD
            <FaAngleDown
              className={`section-icon ${openSections.historial ? "open" : ""}`}
            />
          </h2>
          <div
            className={`section-content ${
              openSections.historial ? "visible" : ""
            }`}
          >
            {/* Cambiado de activity-item a activity-link para que el CSS coincida */}
            <div className="activity-link">
              <Link to="/bitacora">Bitacora</Link>
            </div>
          </div>
        </section>

        {/* Sección de Usuarios y Roles */}
        <section className="account-section">
          <h2
            className="section-title"
            onClick={() => toggleSection("usuarios")}
          >
            USUARIOS Y ROLES
            <FaAngleDown
              className={`section-icon ${openSections.usuarios ? "open" : ""}`}
            />
          </h2>
          <div
            className={`section-content ${
              openSections.usuarios ? "visible" : ""
            }`}
          >
            <div className="roles-link">
              <a href="/usuarioscrud">Registro de usuarios / Ver usuarios activos</a>
            </div>
            
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MiCuenta;
