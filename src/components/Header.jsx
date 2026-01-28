// Header.jsx
import { useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import logo from '../img/usojobanicB.png';
import { Button } from "../components/Button";
import "../css/Header.css";

export default function Header() {
  const [showSubMenu, setShowSubMenu] = useState(false);
  const submenuRef = useRef(null);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/Login");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (submenuRef.current && !submenuRef.current.contains(event.target)) {
        setShowSubMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSubMenu = () => {
    setShowSubMenu((prev) => !prev);
  };

  return (
    <header className="header">
      <div className="header-logo-container">
        <a href="/" className="header-logo-container">
          <img src={logo} alt="Logo" className="header-logo" />
          <span className="header-company-name">Usojobanic RC</span>
        </a>
      </div>

      <div className="header-right-section">
        <nav className="header-nav">
          <ul className="header-nav-list">
            <li><a href="/">INICIO</a></li>
            <li className="header-submenu-container" ref={submenuRef}>
              <button className="header-submenu-toggle" onClick={toggleSubMenu}>
                CONÓCENOS <i className="bi bi-caret-down"></i>
              </button>
              {showSubMenu && (
                <ul className="header-submenu">
                  <li><a href="/conocenos#mision">Misión</a></li>
                  <li><a href="/conocenos#vision">Visión</a></li>
                  <li><a href="/conocenos#principios">Principios</a></li>
                  <li><a href="/conocenos#circuitos">Circuitos</a></li>
                </ul>
              )}
            </li>
            <li><a href="/eventos-publicos">EVENTOS</a></li>
            <li><Button name="Ingresa" onClick={handleLoginClick} /></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}