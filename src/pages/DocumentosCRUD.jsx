import React, { useState } from 'react';
import GenericCRUDTable from "../components/GenericCRUDTemplate.jsx";
import Sidebar from '../components/Sidebar';
import Cabecera from '../components/Cabecera';
import GenericoForm from '../components/GenericForm.jsx';
import '../css/CRUDStyles.css';

// --- 1. DEFINICIÓN DE LA CONFIGURACIÓN ---

//esto es como un manual de instrucciones
const DOCUMENTO_CONFIG = {
    tableName: 'documentos',

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
        { key: 'id', label: 'ID', type: 'number',hideInTable: true, hideInForm: true },
        { key: 'titulo', label: 'Titulo', type: 'text' },
        { key: 'url_drive', label: 'URL', type: 'text' },
        { key: 'tipo_documento', label: 'Tipo', type: 'text' },
        { key: 'fecha_registro', label: 'Fecha Registro', type: 'date', render: (value) => new Date(value).toLocaleDateString()},
    ],

    filters: [
        // 1. FILTRO POR TÍTULO (Búsqueda Parcial)
        {
            key: 'titulo',
            label: 'Buscar por nombre',
            type: 'text',
            operator: 'ilike' // Usará 'titulo_ilike' en useCRUD
        },

       
        {
            key: 'tipo_documento',
            label: 'Filtrar por Tipo',
            type: 'select',
            operator: 'eq', 
            // Aquí iría el array de opciones (que debes cargar desde la tabla 'tipos_eventos')
            options: [
                { value: '', label: '— Todos los Tipos —' },
                { value: 'EXCEL', label: 'EXCEL' },
                { value: 'WORD', label: 'WORD' },
                { value: 'PDF', label: 'PDF' },
            ]
        },
    ],

        
};
const DocumentosCRUD = () => {

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
                    config={DOCUMENTO_CONFIG} // ⬅️ Le pasas el "manual de instrucciones"
                />
            </div>
        </>
    )

}
export default DocumentosCRUD;