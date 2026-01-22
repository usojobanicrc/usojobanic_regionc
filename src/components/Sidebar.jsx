// src/components/Sidebar.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FaTimes,
  FaAngleDown,
  FaCalendarAlt,
  FaUsers,
  FaChurch,
  FaBoxOpen,
  FaFileAlt,
  FaChartBar,
} from "react-icons/fa";
import "../css/Sidebar.css";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const sidebarRef = useRef(null);

  const toggleSubMenu = (menuKey) => {
    setOpenSubMenu(openSubMenu === menuKey ? null : menuKey);
  };

  const handleClickOutside = useCallback(
    (event) => {
      const isOutsideSidebar =
        sidebarRef.current && !sidebarRef.current.contains(event.target);
      const isToggleBtn = event.target.closest(".menu-toggle-btn");

      if (isOpen && isOutsideSidebar && !isToggleBtn) {
        toggleSidebar();
      }
    },
    [isOpen, toggleSidebar]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

    // 👇 AÑADE ESTE BLOQUE 👇
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
  }, [isOpen]);
  // 👆 FIN DEL BLOQUE AÑADIDO 👆

  const navigate = useNavigate();
  const routes = {
    "Registro de evento": "/addevent",
    "Registro de iglesias": "/iglesiascrud",
    "Registro eventos": "/eventoscrud",
    //"Listado de evento": "/eventos",
    //"Seguimiento de eventos": "/seguimiento",
    //"Presupuesto por evento": "/presupuestos",
    //"Tipos de eventos": "/tipo-eventos",

   
    "Estadisticas de Evento": "/estadisticaseventos",


    "Historial de participación": "/HistorialParticipacion",

     "Registro de inventario": "/inventariocrud",
    // "Control de movimientos": "/inventario/movimientos",
    // "Alertas de inventario": "/inventario/alertas",

    "Registro de documento": "/documentoscrud",
    // "Listado y búsqueda": "/documentos",
    // "Modificación y eliminación lógica": "/documentos/editar",

    "Generación de reportes": "/reporteseventoscrud",
    // "Exportación rápida desde dashboard": "/reportes/exportar",
  };

  const handleSubmenuClick = (itemName) => {
    const route = routes[itemName];

    if (route) {
      navigate(route);
      toggleSidebar(); // Cierra sidebar al navegar
    } else {
      console.warn(`No se encontró ruta para: ${itemName}`);
    }
  };

  return (
    <nav ref={sidebarRef} className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <button className="sidebar-close-btn" onClick={toggleSidebar}>
          <FaTimes />
        </button>
      </div>
      <ul className="sidebar-menu">
        {/*-- Inicio directo --*/}
            <li className="sidebar-menu-item no-submenu">
              <button
                type="button"
                className="sidebar-menu-link direct-link"
                onClick={() => {
                  navigate("/dashboard");
                  toggleSidebar();
                }}
              >
                <FaChartBar className="sidebar-menu-icon" />
                <span>INICIO</span>
              </button>
            </li>

            <hr className="sidebar-divider" />
        <li className="sidebar-menu-item">
          <div
            className="sidebar-menu-link"
            onClick={() => toggleSubMenu("eventos")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                toggleSubMenu("eventos");
              }
            }}
          >

            <FaCalendarAlt className="sidebar-menu-icon" />
            <span>EVENTOS</span>
            <FaAngleDown
              className={`sidebar-dropdown-arrow ${
                openSubMenu === "eventos" ? "open" : ""
              }`}
            />
          </div>
          <ul
            className={`sidebar-submenu ${
              openSubMenu === "eventos" ? "visible" : ""
            }`}
          >
            <li>
              <button
                type="button"
                className="sidebar-submenu-item-btn"
                onClick={() => handleSubmenuClick("Registro eventos")}
              >
                Registro de evento
              </button>
            </li>
            
          </ul>
        </li>

        <li className="sidebar-menu-item">
          <div
            className="sidebar-menu-link"
            onClick={() => toggleSubMenu("participantes")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                toggleSubMenu("participantes");
              }
            }}
          >
            <FaUsers className="sidebar-menu-icon" />
            <span>GESTION</span>
            <FaAngleDown
              className={`sidebar-dropdown-arrow ${
                openSubMenu === "participantes" ? "open" : ""
              }`}
            />
          </div>
          <ul
            className={`sidebar-submenu ${
              openSubMenu === "participantes" ? "visible" : ""
            }`}
          >
            <li>
              <button
                type="button"
                className="sidebar-submenu-item-btn"
                onClick={() => handleSubmenuClick("Estadisticas de Evento")}
              >
                Estadisticas de Eventos
              </button>
            </li>
          </ul>
        </li>

        <li className="sidebar-menu-item">
          <div
            className="sidebar-menu-link"
            onClick={() => toggleSubMenu("iglesias")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                toggleSubMenu("iglesias");
              }
            }}
          >
            <FaChurch className="sidebar-menu-icon" />
            <span>IGLESIAS</span>
            <FaAngleDown
              className={`sidebar-dropdown-arrow ${
                openSubMenu === "iglesias" ? "open" : ""
              }`}
            />
          </div>
          <ul
            className={`sidebar-submenu ${
              openSubMenu === "iglesias" ? "visible" : ""
            }`}
          >
            <li>
              <button
                type="button"
                className="sidebar-submenu-item-btn"
                onClick={() => handleSubmenuClick("Registro de iglesias")}
              >
                Registro de iglesias
              </button>
            </li>
            <li>
              <button
                type="button"
                className="sidebar-submenu-item-btn"
                onClick={() => handleSubmenuClick("Historial de participación")}
              >
                Historial de participación
              </button>
            </li>
          </ul>
        </li>

        <li className="sidebar-menu-item">
          <div
            className="sidebar-menu-link"
            onClick={() => toggleSubMenu("inventario")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                toggleSubMenu("inventario");
              }
            }}
          >
            <FaBoxOpen className="sidebar-menu-icon" />
            <span>INVENTARIO</span>
            <FaAngleDown
              className={`sidebar-dropdown-arrow ${
                openSubMenu === "inventario" ? "open" : ""
              }`}
            />
          </div>
          <ul
            className={`sidebar-submenu ${
              openSubMenu === "inventario" ? "visible" : ""
            }`}
          >
            <li>
              <button
                type="button"
                className="sidebar-submenu-item-btn"
                onClick={() => handleSubmenuClick("Registro de inventario")}
              >
                Registro de inventario
              </button>
            </li>
          </ul>
        </li>

        <li className="sidebar-menu-item">
          <div
            className="sidebar-menu-link"
            onClick={() => toggleSubMenu("documentos")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                toggleSubMenu("documentos");
              }
            }}
          >
            <FaFileAlt className="sidebar-menu-icon" />
            <span>DOCUMENTOS</span>
            <FaAngleDown
              className={`sidebar-dropdown-arrow ${
                openSubMenu === "documentos" ? "open" : ""
              }`}
            />
          </div>
          <ul
            className={`sidebar-submenu ${
              openSubMenu === "documentos" ? "visible" : ""
            }`}
          >
            <li>
              <button
                type="button"
                className="sidebar-submenu-item-btn"
                onClick={() => handleSubmenuClick("Registro de documento")}
              >
                Registrar documento
              </button>
            </li>
          </ul>
        </li>

        <li className="sidebar-menu-item">
          <div
            className="sidebar-menu-link"
            onClick={() => toggleSubMenu("reportes")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                toggleSubMenu("reportes");
              }
            }}
          >
            <FaChartBar className="sidebar-menu-icon" />
            <span>REPORTES</span>
            <FaAngleDown
              className={`sidebar-dropdown-arrow ${
                openSubMenu === "reportes" ? "open" : ""
              }`}
            />
          </div>
          <ul
            className={`sidebar-submenu ${
              openSubMenu === "reportes" ? "visible" : ""
            }`}
          >
            <li>
              <button
                type="button"
                className="sidebar-submenu-item-btn"
                onClick={() => handleSubmenuClick("Generación de reportes")}
              >
                Generación de reportes
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
