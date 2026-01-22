// src/pages/UsuariosCRUD.jsx
import React, { useState, useEffect, useMemo } from 'react';
import GenericCRUDTable from "../components/GenericCRUDTemplate";
import Sidebar from '../components/Sidebar';
import Cabecera from '../components/Cabecera';
import { supabase } from '../utils/supabaseClient';
import GenericoForm from '../components/GenericForm.jsx';
import '../css/CRUDStyles.css';

const userRelations = [
    // Sintaxis: TABLA_PIVOTE (campo_pivote_a_usar, TABLA_FINAL (campos_finales))
    // La clave 'usuarios_roles' debe coincidir con el nombre de la tabla pivote.
    'usuarios_roles(rol_id, roles(nombre_rol))' 
];

const UsuariosCRUD = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [rolesOptions, setRolesOptions] = useState([]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Cargar roles desde la base de datos
    useEffect(() => {
        const fetchRoles = async () => {
            const { data, error } = await supabase
                .from('roles')
                .select('id, nombre_rol')
                .order('nombre_rol', { ascending: true });

            if (error) {
                console.error('Error al cargar roles:', error);
                return;
            }

            const options = data.map(r => ({
                value: r.id.toString(),
                label: r.nombre_rol || `Rol ${r.id}`
            }));

            setRolesOptions([
                { value: '', label: '— Selecciona un Rol —' },
                ...options
            ]);
        };

        fetchRoles();
    }, []);

    // Configuración del CRUD (memoizada para evitar parpadeo)
    const USUARIOS_CONFIG = useMemo(() => ({
        tableName: 'usuarios',

        formComponent: GenericoForm,

       
        relations: ['usuarios_roles(rol_id, roles(id, nombre_rol))'],

        buttons: {
            canCreate: true,
            canEdit: true,
            canDelete: true,
        },

        columnConfig: [
            { key: 'nombre', label: 'Nombre', type: 'text', required: true },
            { key: 'apellido', label: 'Apellido', type: 'text', required: true },
            { key: 'correo', label: 'Correo', type: 'email', required: true },
            { key: 'telefono', label: 'Teléfono', type: 'text' },
            {
                key: 'fecha_nacimiento',
                label: 'Nacimiento',
                type: 'date',
                render: (value) =>
                    value ? new Date(value).toLocaleDateString() : '—'
            },
            {
                key: 'estado',
                label: 'Activo',
                type: 'boolean',
                render: (value) =>
                    value
                        ? <span style={{ color: 'green' }}>✅ Sí</span>
                        : <span style={{ color: 'red' }}>❌ No</span>
            },
            { key: 'foto_url', label: 'Foto (URL)', type: 'url' },
            {
                key: 'usuarios_roles',
                label: 'Rol Asignado',
                type: 'select',
                options: rolesOptions,
                hideInForm: true,
                hideInTable: false,
                render: (value) => {
                    const rol = value?.[0]?.roles?.nombre_rol;
                    return rol || '— Sin rol —';
                }
            },
            {
                key: 'rol_id',
                label: 'Rol',
                type: 'select',
                options: rolesOptions,
                hideInTable: true,
                hideInForm: false,
                
            }
        ],

        filters: [
            {
                key: 'nombre',
                label: 'Buscar por Nombre',
                type: 'text',
                operator: 'ilike'
            },
            {
                key: 'apellido',
                label: 'Buscar por Apellido',
                type: 'text',
                operator: 'ilike'
            },
            {
                key: 'correo',
                label: 'Filtrar por Correo',
                type: 'text',
                operator: 'ilike'
            },
            {
                key: 'estado',
                label: 'Estado',
                type: 'select',
                operator: 'eq',
                options: [
                    { value: '', label: 'Todos' },
                    { value: 'true', label: '✅ Activo' },
                    { value: 'false', label: '❌ Inactivo' }
                ]
            },
           
        ]
    }), [rolesOptions]);

    return (
        <>
            <Cabecera onMenuClick={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="page-container">
                <GenericCRUDTable config={USUARIOS_CONFIG} />
            </div>
        </>
    );
};

export default UsuariosCRUD;
