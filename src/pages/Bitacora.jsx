import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../utils/supabaseClient";
import Sidebar from "../components/Sidebar";
import Cabecera from "../components/Cabecera";
import "../css/Bitacora.css";
import { FaSyncAlt, FaEraser, FaFilePdf, FaFileExcel } from "react-icons/fa";

// Librerías para exportar
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Bitacora() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [bitacora, setBitacora] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({});

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Listas de filtros
  const actividades = [
    "Inicio de sesión",
    "Cierre de sesión",
    "CREACIÓN DE REGISTRO",
    "EDICIÓN DE REGISTRO",
    "ELIMINACIÓN DE REGISTRO",
  ];

  const tablas = [
    "auth",
    "usuarios",
    "eventos",
    "iglesias",
    "inventario",
    "documentos",
  ];

  // ---------- FUNCIÓN PRINCIPAL ----------
  const loadHistory = useCallback(
    async (custom = activeFilters) => {
      setLoading(true);

      let query = supabase
        .from("bitacora")
        .select("*, usuarios(id, nombre, apellido)")
        .order("fecha", { ascending: false });

      Object.entries(custom).forEach(([name, value]) => {
        if (!value) return;

        const [key, op] = name.split("_");

        if (op === "ilike") query = query.ilike(key, `%${value}%`);
        else if (op === "eq") query = query.eq(key, value);
      });

      const { data } = await query;
      setBitacora(data || []);
      setLoading(false);
    },
    [activeFilters]
  );

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // ---------- FILTROS ----------
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const next = { ...activeFilters, [name]: value };
    setActiveFilters(next);
    loadHistory(next);
  };

  const clearFilters = () => {
    setActiveFilters({});
    loadHistory({});
  };

  // ---------- EXPORTAR PDF ----------
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Bitácora de Actividad", 14, 15);

    const tableData = bitacora.map((row) => [
      row.usuarios
        ? `${row.usuarios.nombre} ${row.usuarios.apellido}`
        : "Desconocido",
      row.actividad,
      row.tabla_afectada,
      row.linea_id ?? "—",
      new Date(row.fecha).toLocaleString("es-NI", {
        timeZone: "America/Managua",
        hour12: false,
      }),
    ]);

    autoTable(doc, {
      head: [["Usuario", "Actividad", "Tabla", "ID", "Fecha"]],
      body: tableData,
      startY: 20,
    });

    doc.save("bitacora.pdf");
  };

  // ---------- EXPORTAR EXCEL ----------
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      bitacora.map((row) => ({
        Usuario: row.usuarios
          ? `${row.usuarios.nombre} ${row.usuarios.apellido}`
          : "Desconocido",
        Actividad: row.actividad,
        Tabla: row.tabla_afectada,
        "ID Afectado": row.linea_id ?? "—",
        Fecha: new Date(row.fecha).toLocaleString("es-NI", {
          timeZone: "America/Managua",
          hour12: false,
        }),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bitacora");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      "bitacora.xlsx"
    );
  };

  return (
    <>
      <Cabecera onMenuClick={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="page-container bitacora-page">
        <h1 className="bitacora-title">Bitácora de Actividad</h1>

         {/* --- FILTROS Y BOTONES --- */}
        <div className="filter-container">
          {/* Actividad */}
          <div className="filter-group">
            <label>Actividad</label>
            <select
              name="actividad_eq"
              value={activeFilters.actividad_eq || ""}
              onChange={handleFilterChange}
            >
              <option value="">Todas</option>
              {actividades.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Tabla */}
          <div className="filter-group">
            <label>Tabla</label>
            <select
              name="tabla_afectada_eq"
              value={activeFilters.tabla_afectada_eq || ""}
              onChange={handleFilterChange}
            >
              <option value="">Todas</option>
              {tablas.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* ID */}
          <div className="filter-group">
            <label>ID Afectado</label>
            <input
              type="number"
              name="linea_id_eq"
              value={activeFilters.linea_id_eq || ""}
              onChange={handleFilterChange}
              placeholder="ID"
            />
          </div>

          {/* RECARGAR */}
          <button className="btn-base btn-reload" onClick={() => loadHistory()}>
            <FaSyncAlt />
          </button>

          {/* LIMPIAR */}
          <button className="btn-base btn-clear" onClick={clearFilters}>
            <FaEraser />
          </button>

          {/* PDF */}
          <button className="btn-base btn-pdf" onClick={exportPDF}>
            <FaFilePdf />
          </button>

          {/* EXCEL */}
          <button className="btn-base btn-excel" onClick={exportExcel}>
            <FaFileExcel />
          </button>
        </div>

        {/* --- TABLA --- */}
        <div className="bitacora-table-container">
          {loading ? (
            <p>Cargando...</p>
          ) : bitacora.length === 0 ? (
            <p className="no-records">No hay registros coincidentes</p>
          ) : (
            <table className="bitacora-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Actividad</th>
                  <th>Tabla</th>
                  <th>ID Afectado</th>
                  <th>Fecha</th>
                </tr>
              </thead>

              <tbody>
                {bitacora.map((row) => (
                  <tr key={row.id}>
                    <td>
                      {row.usuarios
                        ? `${row.usuarios.nombre} ${row.usuarios.apellido}`
                        : "Desconocido"}
                    </td>
                    <td>{row.actividad}</td>
                    <td>{row.tabla_afectada}</td>
                    <td>{row.linea_id ?? "—"}</td>
                    <td>
                      {new Date(row.fecha).toLocaleString("es-NI", {
                        timeZone: "America/Managua",
                        hour12: false,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
