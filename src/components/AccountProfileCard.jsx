// src/components/AccountProfileCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 Importa useNavigate
import '../css/AccountProfileCard.css';
import userAvatar from '../img/usojobanicB.png';
import { supabase } from "../utils/supabaseClient";
import { logActivity } from "../utils/logActivity";


const AccountProfileCard = ({ user }) => {
  const navigate = useNavigate(); // 👈 Hook para navegar
  
 //Salir sesión
  const handleLogout = async () => {
    await logActivity(user.id, "Cierre de sesión", "auth", null);
    await supabase.auth.signOut();
    navigate("/login");
  };

  // FOTO FINAL QUE SE MOSTRARÁ
  const profilePhoto = user?.foto_url ? user.foto_url : userAvatar;

  return (
    <div className="account-profile-card">
      <div className="profile-header">
        <img src={profilePhoto} 
          alt="User Avatar" 
          className="profile-avatar" />
        <div className="profile-info">
          <h2 className="profile-name">{user ? `${user.nombre} ${user.apellido}` : "Cargando..."}</h2>
          <p className="profile-role">{user?.rol_asignado ? user.rol_asignado : "Sin rol asignado"}</p>
        </div>
        <button className="close-session-btn" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default AccountProfileCard;