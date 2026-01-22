import React, { useState } from 'react';
import GenericCRUDTable from "../components/GenericCRUDTemplate.jsx";
import Sidebar from '../components/Sidebar';
import Cabecera from '../components/Cabecera';
import GenericoForm from '../components/GenericForm.jsx';
import '../css/CRUDStyles.css';

// --- 1. DEFINICIÓN DE LA CONFIGURACIÓN ---

//esto es como un manual de instrucciones
const INVENTARIO_CONFIG = {
    tableName: 'inventario',

     relations: [
    ],

    formComponent: GenericoForm, 

    // esto muestra que botones de accion se permiten
    buttons: {
        canCreate: true,  
        canEdit: true,    
        canDelete: true, 
    },

    // aqui definimos las columnas de la tabla
    columnConfig: [
        { key: 'id', label: 'ID', type: 'number', hideInTable: true, hideInForm: true },
        { key: 'nombre_articulo', label: 'Nombre', type: 'text' },
        { key: 'caracteristicas', label: 'Caracteristicas', type: 'text' },
        { key: 'cantidad', label: 'Cantidad', type: 'number' },
        { key: 'precio_compra', label: 'Precio Compra', type: 'number' },
        { key: 'estado', label: 'Estado', type: 'text' },
        { key: 'ubicacion', label: 'Ubicación', type: 'text' },
    ],

    filters: [
        // 1. FILTRO POR TÍTULO (Búsqueda Parcial)
        {
            key: 'nombre_articulo',
            label: 'Buscar por nombre',
            type: 'text',
            operator: 'ilike' // Usará 'titulo_ilike' en useCRUD
        },

       
        {
            key: 'estado',
            label: 'Filtrar por Estado',
            type: 'select',
            operator: 'eq', // Usará 'tipo_evento_id_eq' en useCRUD
            // Aquí iría el array de opciones (que debes cargar desde la tabla 'tipos_eventos')
            options: [
                { value: '', label: '— Todos los Tipos —' },
                { value: 'Nuevo', label: 'Nuevo' },
                { value: 'Semi-Nuevo', label: 'Semi-Nuevo' },
            ]
        },
    ],

        
};
const InventarioCRUD = () => {

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
                    config={INVENTARIO_CONFIG} // ⬅️ Le pasas el "manual de instrucciones"
                />
            </div>
        </>
    )

}
export default InventarioCRUD;