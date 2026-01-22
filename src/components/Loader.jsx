import React from "react";
import "../css/Cargando.css"; 

export default function Loader() {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>Cargando...</p>
    </div>
  );
}
