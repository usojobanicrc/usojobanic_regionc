import React, { useState } from 'react';
import GenericCRUDTable from "../components/GenericCRUDTemplate.jsx";
import Sidebar from '../components/Sidebar';
import Cabecera from '../components/Cabecera';
import GenericoForm from '../components/GenericForm.jsx';
import '../css/CRUDStyles.css';

// --- 1. DEFINICIÓN DE LA CONFIGURACIÓN ---

//esto es como un manual de instrucciones
const circuitoOptions = [
    { value: 1, label: 'Circuito 1' },
    { value: 2, label: 'Circuito 2' },
    { value: 3, label: 'Circuito 3' },
    { value: 4, label: 'Circuito 4' },
    { value: 5, label: 'Circuito 5' },
    { value: 6, label: 'Circuito 6' },
    { value: 7, label: 'Circuito 7' },
    { value: 8, label: 'Circuito 7B' },
    { value: 9, label: 'Circuito 8' },
];


const IGLESIAS_CONFIG = {
    tableName: 'iglesias',

    // Asegúrate de que IglesiasForm esté importado y asignado aquí.
    formComponent: GenericoForm,

    // Define las claves foráneas a cargar como objetos anidados
    // Esto es crucial para que la tabla pueda mostrar el nombre del circuito.
    relations: ['circuito_id(id,nombre)'],

    // Configuración de botones CRUD
    buttons: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
    },

    // --- Configuración de Columnas (Para la Tabla de Visualización) ---
    columnConfig: [
        { key: 'id', label: 'ID', type: 'number' },

        // 1. Clave Foránea: circuito_id
        {
            key: 'circuito_id',
            label: 'Circuito',
            type: 'select',
            options: circuitoOptions,
            render: (value) => value?.nombre || 'N/A'
        },

        // 2. Campos de Texto
        { key: 'nombre', label: 'Nombre', type: 'text', },
        { key: 'direccion', label: 'Direccion', type: 'text', },
        { key: 'url_direccion', label: 'Mapa (URL)', type: 'url', },

        // 3. Campo de Fecha
        {
            key: 'fecha_origen',
            label: 'Fundada',
            type: 'date',
            render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A'
        },

        // 4. Campo Booleano
        {
            key: 'estado_junta',
            label: 'Estado Junta',
            type: 'boolean',
            required: false,
            render: (value) => {
                if (value === true) {
                    return <span style={{ color: 'green', fontWeight: 'bold' }}>✅ Activa</span>;
                } else if (value === false) {
                    return <span style={{ color: 'red', fontWeight: 'bold' }}>❌ No Activa</span>;
                }
                return <span>Indefinido</span>;
            }
        }
    ],

    // --- Configuración de Filtros (Para la Barra de Control Superior) ---
    filters: [
        {
            key: 'nombre',
            label: 'Buscar por Nombre',
            type: 'text',
            operator: 'ilike'
        },
        {
            key: 'circuito_id',
            label: 'Filtrar por circuito',
            operator: 'eq',
            type: 'select',
            // ⭐ Los filtros SÍ necesitan las opciones ⭐
            options: [
                { value: '', label: 'Todas' },
                // Asegúrate que los valores de las opciones coincidan con los IDs numéricos
                ...circuitoOptions
            ]
        },
        {
            key: 'estado_junta',
            label: 'Miembro de Junta',
            operator: 'eq',
            type: 'select',
            options: [
                { value: '', label: 'Todos' },
                { value: 'true', label: '✅ Activa' },
                { value: 'false', label: '❌ No Activa' }
            ]
        }
    ]
};
const IglesiasCRUD = () => {

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
                    config={IGLESIAS_CONFIG} // ⬅️ Le pasas el "manual de instrucciones"
                />
            </div>
        </>
    )

}
export default IglesiasCRUD;