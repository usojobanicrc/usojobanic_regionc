import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import GenericCRUDTable from "../components/GenericCRUDTemplate.jsx";
import Sidebar from '../components/Sidebar';
import Cabecera from '../components/Cabecera';
import AddEvent from '../pages/AddEvent';
import '../css/CRUDStyles.css';

// --- 1. DEFINICIÓN DE LA CONFIGURACIÓN (CORREGIDA) ---

const REPORTESEVENTOS_CONFIG = {
    tableName: 'eventos',

    formComponent: AddEvent,

    modalWidth: '800px',

    // 🚨 RELACIONES CORREGIDAS: 
    // Usamos 'eventos_iglesias' que es el nombre REAL de la tabla N:M.
    relations: [
        'tipos_eventos!tipo_evento_id(id, descripcion)',
        // Solo necesitamos la tabla de pivote (eventos_iglesias) y el ID de la iglesia.
        // La sintaxis 'eventos_iglesias!left(iglesia_id)' es la más limpia.
        'eventos_iglesias(id,asistencia,iglesia_id,evento_id)',

        'evaluaciones(id,sugerencias,puntos_fuertes,puntos_debiles,evento_id)'
    ],

    buttons: {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canReport: true,   // PDF por fila + PDF global
        canExcel: true,

        canExcelRow: false
    },

    columnConfig: [
        { key: 'titulo', label: 'Titulo', type: 'text' },
        {
            key: 'tipos_eventos',
            label: 'Tipo',
            type: 'select',
            render: (value) => value?.descripcion || "—"
        },
        { key: 'lugar', label: 'Lugar', type: 'text' },
        {
            key: 'fecha_inicio',
            label: 'Inicio',
            type: 'date',
            render: (value) => new Date(value).toLocaleDateString()
        },
        {
            key: 'fecha_final',
            label: 'Finalizo',
            type: 'date',
            render: (value) => new Date(value).toLocaleDateString()
        },
        { key: 'estado_evento', label: 'Estado', type: 'text' },
    ],

    filters: [
        { key: 'titulo', label: 'Buscar por Título', type: 'text', operator: 'ilike' },
        {
            key: 'tipo_evento_id',
            label: 'Filtrar por Tipo',
            type: 'select',
            operator: 'eq',
            // NOTA: Es mejor cargar estos valores dinámicamente o usar un catálogo de IDs reales.
            options: [
                { value: '', label: '— Todos los Tipos —' },
                { value: 1, label: 'Culto Unido' },
                { value: 2, label: 'Campamento' },
            ]
        },
        { key: 'fecha_inicio', label: 'Desde Fecha', type: 'date', operator: 'gte' },
        { key: 'fecha_inicio', label: 'Hasta Fecha', type: 'date', operator: 'lte' },
    ],
};

const EventosCRUD = () => {
    // ... (la lógica del componente se mantiene igual)

    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <Cabecera onMenuClick={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="page-container">

                <GenericCRUDTable
                    config={REPORTESEVENTOS_CONFIG} // ⬅️ Ahora con la configuración corregida
                />
            </div>
        </>
    )

}
export default EventosCRUD;