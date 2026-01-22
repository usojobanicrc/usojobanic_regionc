import React, { useState, useEffect, useMemo } from 'react';
import { useCRUD } from '../hooks/useCRUD';
import useDebounce from '../hooks/useDebounce';
import CRUDActions from '../components/CRUDActions';
import GenericModal from '../components/GenericModal';

// Importar iconos
import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";
import autoTable from "jspdf-autotable";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { FaPlus, FaSyncAlt } from 'react-icons/fa';

import { FaFilePdf, FaFileExcel } from "react-icons/fa6";



// =====================================================
// 📄 Generar PDF general
// =====================================================
const generatePDFReport = async (data, filters) => {
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "letter" });

    const logo = await fetch("/logo de convencion bautista.jpg")
        .then(res => res.blob())
        .then(blob => new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        }));

    // Header
    doc.addImage(logo, "JPEG", 40, 30, 70, 70);
    doc.setFontSize(22);
    doc.text("Reporte General de Eventos", 130, 70);

    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 130, 95);

    const tableBody = data.map(ev => [
        ev.titulo,
        ev.tipos_eventos?.descripcion || "—",
        ev.lugar,
        ev.fecha_inicio ? new Date(ev.fecha_inicio).toLocaleDateString() : "—",
        ev.fecha_final ? new Date(ev.fecha_final).toLocaleDateString() : "—",
        ev.estado_evento
    ]);

    autoTable(doc, {
        startY: 140,
        head: [["Título", "Tipo", "Lugar", "Inicio", "Fin", "Estado"]],
        body: tableBody,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [22, 66, 140], textColor: 255, fontStyle: "bold" },
    });

    doc.save("reporte_eventos.pdf");
};


// =====================================================
// 📊 Generar Excel general
// =====================================================
const generateExcelReport = (data) => {
    const excelData = data.map(ev => ({
        "Título": ev.titulo,
        "Tipo": ev.tipos_eventos?.descripcion || "—",
        "Lugar": ev.lugar,
        "Fecha Inicio": ev.fecha_inicio?.split("T")[0] || "—",
        "Fecha Final": ev.fecha_final?.split("T")[0] || "—",
        "Estado": ev.estado_evento,
    }));

    const wb = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(excelData);

    XLSX.utils.book_append_sheet(wb, sheet, "Eventos");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
        new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
        "reporte_eventos.xlsx"
    );
};


// 🔥 CORRECCIÓN 1: Establecer config = {} como valor por defecto
function GenericCRUDTable({ config = {}, onCreate }) {

    // 1. DESESTRUCTURACIÓN Y EXTRACCIÓN DE RELATIONS
    const {
        tableName,
        columnConfig,
        buttons,
        filters = [],
        relations = [],
        modalWidth
    } = config; // Desestructuración segura

    // 2. ESTABILIZAR 'relations' con useMemo
    const stableRelations = useMemo(() => relations, [relations]);

    // 3. Estabilizar 'filters' con useMemo
    const stableFilters = useMemo(() => filters, [filters]);

    // Estados
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [activeFilters, setActiveFilters] = useState({});

    // Debounce
    const debouncedFilters = useDebounce(activeFilters, 1000);

    const FormToRender = config.formComponent;

    // 4. USAR EL CUSTOM HOOK Y PASAR 'relations'
    const {
        data,
        loading,
        error,
        fetchData,
        createRecord,
        updateRecord,
        deleteRecord,
        getRecordById
    } = useCRUD(tableName, stableRelations);


    // --- LÓGICA DE FILTROS ---

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setActiveFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Hook para disparar la consulta cuando los filtros cambian
    useEffect(() => {
        // Asegurarse de que tableName exista antes de llamar a fetchData
        if (tableName) {
            fetchData(debouncedFilters);
        }
    }, [fetchData, debouncedFilters, tableName]); // Añadir tableName como dependencia

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRecord(null);
    };

    // 🔥 NUEVA FUNCIÓN: Llamada al finalizar el CRUD en el formulario especializado (AddEvento)
    const handleFormSubmitSuccess = () => {


        handleCloseModal(); // Cierra el modal
        fetchData(activeFilters); // Refresca la tabla
    };

    const handleGeneratePDFRow = (record) => generateEventPDF(record);
    const handleGeneratePDF = () => generatePDFReport(data, activeFilters);
    const handleGenerateExcel = () => generateExcelReport(data);


    // --- MANEJO DE ACCIONES DE UI ---

    const handleCreateClick = () => {

        console.log("✅ CRUD Table: Botón Crear clickeado.");
        if (onCreate) {
            onCreate();
            return;
        }



        setEditingRecord(null);
        setIsModalOpen(true);
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        // Si contiene 'T', lo corta en el primer carácter 'T'
        return dateString.split('T')[0];
    };

    const flattenFK = (value) => {
        // Si viene como objeto con .id
        if (value && typeof value === "object" && "id" in value) {
            return Number(value.id);
        }

        // Si es número o string-numérico
        const num = Number(value);
        return isNaN(num) ? null : num;
    };



    const handleEditClick = async (record) => {
        console.log(`🔍 Buscando registro completo con ID ${record.id}...`);

        const recordCompleto = await getRecordById(record.id);

        if (!recordCompleto) {
            console.error("❌ No se pudo cargar el registro con relaciones.");
            return;
        }

        console.log("✔ Registro cargado con relaciones:", recordCompleto);

        // Aplanar solo las FKs simples
        const processedRecord = {
            ...recordCompleto,

            tipo_evento_id: flattenFK(recordCompleto.tipo_evento_id),
            circuito_id: flattenFK(recordCompleto.circuito_id),

            fecha_origen: formatDateForInput(recordCompleto.fecha_origen),

            rol_id: recordCompleto.usuarios_roles?.[0]?.rol_id ?? ""
        };

        console.log("➡️ CRUD Table: Record Procesado para Edición:", processedRecord);

        setEditingRecord(processedRecord);
        setIsModalOpen(true);
    };


    const handleDeleteClick = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este registro? Esta acción es irreversible.')) {
            await deleteRecord(id);
        }
    };

    const handleSubmit = async (formData) => { // Renombrada de handleFormSubmit a handleSubmit
        let success;

        if (editingRecord) {
            success = await updateRecord(editingRecord.id, formData);
        } else {
            success = await createRecord(formData);
        }

        if (success) {
            // ✅ Usar la función de cierre que acabamos de definir
            handleCloseModal();
        } else {
            console.error("Fallo la operación CRUD. Revisa el error en la consola.");
        }
    };

    // =====================================================
    // 📄 Generar PDF individual
    // =====================================================

    const generateEventPDF_HTML = (ev) => {

        // 1️⃣ Crear contenedor invisible donde se va a renderizar el acta
        const element = document.createElement("div");
        element.style.width = "800px";
        element.style.padding = "40px";
        element.style.fontFamily = "Helvetica";
        element.style.position = "relative";

        // 2️⃣ Plantilla del acta en HTML
        element.innerHTML = `
        <div style="position: relative;">

            <!-- MARCA DE AGUA -->
            <img 
                src="/logo de convencion bautista.jpg"
                style="
                    position: absolute;
                    top: 200px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 350px;
                    opacity: 0.06;
                    z-index: 0;
                "
            />

            <div style="position: relative; z-index: 1;">
                
                <!-- ENCABEZADO -->
                <div style="display: flex; align-items: center; gap: 20px;">
                    <img src="/usojobanic rc naranja.png" style="width: 80px;" />
                    <h1 style="margin: 0; font-size: 28px;">ACTA DEL EVENTO</h1>
                </div>

                <hr style="margin: 20px 0;" />

                <!-- DATOS DEL EVENTO -->
                <h2 style="font-size: 20px;">Datos generales</h2>
                <p><strong>Título:</strong> ${ev.titulo}</p>
                <p><strong>Tipo:</strong> ${ev.tipos_eventos?.descripcion || "—"}</p>
                <p><strong>Lugar:</strong> ${ev.lugar || "—"}</p>

                <p><strong>Participantes estimados:</strong> ${ev.participantes_estimados ?? "—"}</p>
                <p><strong>Participantes reales:</strong> ${ev.participantes_reales ?? "—"}</p>

                <p><strong>Fecha inicio:</strong> ${ev.fecha_inicio?.split("T")[0]}</p>
                <p><strong>Fecha final:</strong> ${ev.fecha_final?.split("T")[0]}</p>

                <!-- SECCIÓN 1 -->
                <h3>1. Observaciones de planificación</h3>
                <p>${ev.observaciones_planificacion || "—"}</p>

                <!-- SECCIÓN 2 -->
                <h3>2. Presupuesto</h3>
                <p><strong>Estimado:</strong> C$ ${ev.presupuesto_estimado ?? "—"}</p>
                <p><strong>Real:</strong> C$ ${ev.presupuesto_real ?? "—"}</p>

                <!-- SECCIÓN 3: Evaluación -->
                <h3>3. Evaluación del evento</h3>
                <p><strong>Puntos Fuertes:</strong> ${ev.evaluaciones?.[0]?.puntos_fuertes || "—"}</p>
                <p><strong>Puntos Débiles:</strong> ${ev.evaluaciones?.[0]?.puntos_debiles || "—"}</p>
                <p><strong>Sugerencias:</strong> ${ev.evaluaciones?.[0]?.sugerencias || "—"}</p>

                <!-- SECCIÓN 4: Iglesias -->
               

                <h3 style="margin-top: 40px;">Firma responsable</h3>
                <p>______________________________________________</p>

            </div>
        </div>
    `;

        // 3️⃣ Convertir a PDF
        html2pdf()
            .from(element)
            .set({
                margin: 1,
                filename: `Acta_${ev.titulo}.pdf`,
                html2canvas: { scale: 2 },
                jsPDF: { unit: "pt", format: "letter", orientation: "portrait" }
            })
            .save();
    };
    const generateEventPDF = async (record) => {
        // 1. Traer datos completos desde Supabase
        const fullRecord = await getRecordById(record.id);

        console.log("Evento completo para PDF:", fullRecord);

        // 2. Enviar el record COMPLETO al generador de PDF
        generateEventPDF_HTML(fullRecord);
    };



    // --- RENDERIZADO DE ESTADOS ---

    // 🔥 CORRECCIÓN 2: Mostrar un error si la configuración principal está faltando
    if (!tableName) {
        return <div className="error-message">Error de Configuración: La propiedad 'tableName' está faltando. Asegúrate de pasar el prop 'config' correctamente.</div>;
    }

    if (loading) return null;
    if (error) return <div className="error-message">Error al cargar datos de {tableName}: {error.message}</div>;



    const showActions =
        buttons?.canEdit ||
        buttons?.canDelete ||
        buttons?.canReport ||
        buttons?.canExcel ||
        buttons?.canExcelRow;

    return (
        <div className="crud-container">
            <h2 className="crud-title">{tableName.toUpperCase()}</h2>

            <div className='top-controls-container'>

                {/* 1. RENDERIZADO DE LOS FILTROS PERSONALIZADOS */}
                {/* Asegurarse que stableFilters tenga elementos */}
                {stableFilters?.map(filter => (
                    <div key={`${filter.key}_${filter.operator}`} className="filter-group">
                        <label className="filter-label">{filter.label}</label>

                        {/*LÓGICA DE RENDERIZADO CONDICIONAL: SELECT y INPUT */}
                        {filter.type === 'select' && filter.options ? (
                            <select
                                name={`${filter.key}_${filter.operator}`}
                                value={activeFilters[`${filter.key}_${filter.operator}`] || ''}
                                onChange={handleFilterChange}
                                className="filter-input"
                            >
                                <option value="">Todos</option> {/* Opcional: añadir opción de "Todos" */}
                                {filter.options.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={filter.type}
                                name={`${filter.key}_${filter.operator}`}
                                value={activeFilters[`${filter.key}_${filter.operator}`] || ''}
                                onChange={handleFilterChange}
                                className="filter-input"
                            />
                        )}
                    </div>
                ))}
                {/* 2. Contenedor de Botones (Crear/Recargar) */}
                <div className="top-buttons-container">

                    {buttons?.canCreate && (
                        <button className="btn-base btn-create" onClick={handleCreateClick}>
                            <FaPlus />
                        </button>
                    )}

                    <button className="btn-base btn-reload" onClick={() => fetchData(activeFilters)}>
                        <FaSyncAlt />
                    </button>

                    {buttons?.canReport && (
                        <button className="btn-base btn-report-global" onClick={handleGeneratePDF}>
                            <FaFilePdf />
                        </button>
                    )}

                    {buttons?.canExcel && (
                        <button className="btn-base btn-excel-global" onClick={handleGenerateExcel}>
                            <FaFileExcel />
                        </button>
                    )}

                </div>

            </div>

            {/* --- TABLA DE DATOS --- */}

            <div className="table-scroll-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            {/* Asegurarse que columnConfig tenga elementos */}
                            {columnConfig
                                // 🔥 APLICAR FILTRO PARA NO MOSTRAR SI hideInTable ES TRUE
                                ?.filter(col => !col.hideInTable).map(col => (
                                    <th key={col.key}>{col.label}</th>
                                ))}
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {/* Asegurarse que data tenga elementos */}
                        {data?.map(record => (
                            <tr key={record.id}>
                                {columnConfig
                                    // 🔥 APLICAR FILTRO PARA NO MOSTRAR SI hideInTable ES TRUE
                                    ?.filter(col => !col.hideInTable).map(col => (
                                        <td key={col.key}>
                                            {col.render ? col.render(record[col.key]) : record[col.key]}
                                        </td>
                                    ))}

                                {showActions && (
                                    <td className="actions-cell">
                                        <CRUDActions
                                            record={record}
                                            onEdit={handleEditClick}
                                            onDelete={handleDeleteClick}
                                            onReport={handleGeneratePDFRow}
                                            onExcel={() => console.log("Excel por fila")}
                                            buttons={buttons}
                                        />
                                    </td>
                                )}


                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- MODAL Y FORMULARIO --- */}
            <GenericModal
                title={editingRecord ? `Editar ${tableName}` : `Crear ${tableName}`}
                isVisible={isModalOpen}
                onClose={handleCloseModal}
                width={modalWidth}

            >
                <FormToRender
                    // Uso de encadenamiento opcional
                    fields={config.columnConfig?.filter(c => c.key !== 'id')}
                    initialData={editingRecord}
                    onSubmit={handleFormSubmitSuccess}
                    onClose={handleCloseModal}
                    // PROPS NECESARIOS PARA AddEvento
                    createRecord={createRecord}
                    updateRecord={updateRecord}
                    isEditing={!!editingRecord}
                />
            </GenericModal>
        </div>
    );
}


export default GenericCRUDTable;