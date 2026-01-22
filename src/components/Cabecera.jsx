// src/components/Cabecera.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Importa Link
import { FaBars, FaUserCircle } from 'react-icons/fa'; // Íconos necesarios
import Sidebar from './Sidebar'
import '../css/Cabecera.css'; // Estilos para el Header
import usojobanicLogo from '../img/usojobanicB.png'; // Asegúrate de que este logo esté en src/img/

const Cabecera = ({ onMenuClick }) => {
    return (
        <header className="cabecera">
            <div className="cabecera-left">
                {/* Botón para abrir la Sidebar */}
                <button className="menu-toggle-btn" onClick={onMenuClick}>
                    <FaBars />
                </button>
                {/* Logo y Título de la App */}
                <img src={usojobanicLogo} alt="USOJOBANIC Logo" className="cabecera-logo" />
                <span className="cabecera-title">USOJOBANIC REGIÓN CENTRAL 2025</span>
            </div>
            <div className="cabecera-right">
                <FaUserCircle className="user-icon" />
                
                {/* Reemplaza el botón por un Link */}
                <Link to="/micuenta" className="mi-cuenta-btn">
                    Mi cuenta
                </Link>
            </div>
        </header>
    );
};

export default Cabecera;