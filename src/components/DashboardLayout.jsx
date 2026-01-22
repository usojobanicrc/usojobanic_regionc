// src/components/DashboardLayout.jsx
import React, { useState, useEffect, useRef } from 'react';
import Cabecera from './Cabecera';
import Sidebar from './Sidebar';
import { Footer } from './Footer'; // Se mantiene la importación con llaves
import '../App.css'; // Ruta corregida

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        if (!isSidebarOpen) {
            return;
        }

        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSidebarOpen]);

    return (
        <div className="app-container">
            <Cabecera onMenuClick={toggleSidebar} />
            <Sidebar ref={sidebarRef} isOpen={isSidebarOpen} onClose={toggleSidebar} />
            
            {isSidebarOpen && (
                <div
                    className="sidebar-backdrop"
                    onClick={toggleSidebar}
                    role="button"
                    aria-label="Cerrar menú lateral"
                ></div>
            )}
            
            <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default DashboardLayout;