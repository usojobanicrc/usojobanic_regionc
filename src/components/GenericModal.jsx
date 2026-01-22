import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa'; // Icono para cerrar
import '../css/GenericModal.css';

function GenericModal({ isVisible, title, onClose, children, width = "600px" }) {

    // Efecto para manejar el cierre con la tecla ESC
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isVisible) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isVisible, onClose]);


    if (!isVisible) return null;

    return (
        // El overlay para el fondo gris semi-transparente
        <div className="modal-overlay" onClick={onClose}>
            {/* El contenido del modal, previene el cierre al hacer clic dentro */}
            <div 
                className="modal-content" 
                style={{ maxWidth: width }}
                onClick={(e) => e.stopPropagation()} 
            >
                <div className="modal-header">
                    <h3 className="modal-title">{title}</h3>
                    <button 
                        className="modal-close-btn" 
                        onClick={onClose}
                        aria-label="Cerrar modal"
                    >
                        <FaTimes />
                    </button>
                </div>
                
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default GenericModal;