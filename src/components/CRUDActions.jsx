import React from 'react';
import { FaEdit, FaTrashAlt, FaFileExcel } from 'react-icons/fa';
import { FaFilePdf } from "react-icons/fa6";

/**
 * Muestra los botones de acción para una fila.
 *
 * @param {Object} record   - Los datos de la fila actual
 * @param {Function} onEdit - Callback para editar
 * @param {Function} onDelete - Callback para eliminar (usa record.id)
 * @param {Function} onReport - Callback para generar reporte (opcional)
 * @param {Function} onExcel - Callback para exportar a Excel (opcional)
 * @param {Object} buttons - Visibilidad de botones:
 *   { canEdit, canDelete, canReport, canExcel }
 */
function CRUDActions({
    record,
    onEdit,
    onDelete,
    onReport,
    onExcel,
    buttons = {},
}) {
    // Desestructuramos con valores por defecto en false
    const {
        canEdit = false,
        canDelete = false,
        canReport = false,
        canExcel = false,
        canExcelRow = false
    } = buttons;

    // Si no hay ningún botón permitido, mostramos solo un guión
    if (!canEdit && !canDelete && !canReport && !canExcel && !canExcelRow) {
        return <span>—</span>;
    }

    return (
        <div className="actions-container">
            {canEdit && (
                <button
                    onClick={() => onEdit && onEdit(record)}
                    className="btn-action btn-edit"
                    title="Editar Registro"
                >
                    <FaEdit size={20} />
                </button>
            )}

            {canDelete && (
                <button
                    onClick={() => onDelete && onDelete(record.id)}
                    className="btn-action btn-delete"
                    title="Eliminar Registro"
                >
                    <FaTrashAlt size={20} />
                </button>
            )}

            {canReport && (
                <button
                    onClick={() => onReport && onReport(record)}
                    className="btn-action btn-report"
                    title="Generar reporte de este registro"
                >
                    <FaFilePdf size={20} />
                </button>
            )}

             {canExcelRow && (
                <button
                    onClick={() => onExcel && onExcel(record)}
                    className="btn-action btn-excel"
                    title="Exportar a Excel (fila)"
                >
                    <FaFileExcel size={20} />
                </button>
            )}

        </div>
    );
}

export default CRUDActions;
