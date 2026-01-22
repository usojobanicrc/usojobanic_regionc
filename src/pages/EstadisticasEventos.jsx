import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import Sidebar from '../components/Sidebar';
import Cabecera from '../components/Cabecera';

// Chart.js
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from "chart.js";

import "../css/EstadisticasEventos.css";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

// 🎨 Paleta
const PALETTE = ["#ffc300", "#ff5733", "#c70039", "#900c3e", "#571845"];

export default function EstadisticasEventos() {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        cargarEventos();
    }, []);

    const cargarEventos = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("eventos")
            .select(
                `
          id,
          fecha_inicio,
          estado_evento,
          tipo_evento_id,
          participantes_estimados,
          participantes_reales,
          presupuesto_estimado,
          presupuesto_real,
          tipos_eventos ( descripcion )
        `
            );

        if (error) {
            console.error("Error cargando eventos:", error);
            setLoading(false);
            return;
        }

        setEventos(data || []);
        setLoading(false);
    };

    if (loading) {
        return <p className="text-center mt-10 text-gray-500">Cargando datos...</p>;
    }

    // -------------------------
    //   MÉTRICAS RÁPIDAS
    // -------------------------
    const totalEventos = eventos.length;

    const eventosPlanificacion = eventos.filter(
        (e) => e.estado_evento === "Planificacion"
    ).length;

    const eventosConclusion = eventos.filter(
        (e) => e.estado_evento === "Conclusion"
    ).length;

    const eventosCancelados = eventos.filter(
        (e) => e.estado_evento === "Cancelado"
    ).length;

    const totalEstimados = eventos.reduce(
        (sum, e) => sum + (e.participantes_estimados || 0),
        0
    );
    const totalReales = eventos.reduce(
        (sum, e) => sum + (e.participantes_reales || 0),
        0
    );

    const totalPresupuestoEstimado = eventos.reduce(
        (sum, e) => sum + (e.presupuesto_estimado || 0),
        0
    );

    const totalPresupuestoReal = eventos.reduce(
        (sum, e) => sum + (e.presupuesto_real || 0),
        0
    );

    const cumplimientoAsistencia =
        totalEstimados > 0 ? Math.round((totalReales / totalEstimados) * 100) : 0;

    // -------------------------
    //   GRÁFICO ESTADOS (DOUGHNUT)
    // -------------------------
    const estadosMap = {
        Planificacion: "Planificación",
        Conclusion: "Conclusión",
        Cancelado: "Cancelado",
    };

    const estadosLabels = Object.values(estadosMap);
    const estadosData = [
        eventosPlanificacion,
        eventosConclusion,
        eventosCancelados,
    ];

    const doughnutEstadosData = {
        labels: estadosLabels,
        datasets: [
            {
                data: estadosData,
                backgroundColor: [PALETTE[0], PALETTE[1], PALETTE[2]],
                borderWidth: 2,
                borderColor: "#fff",
            },
        ],
    };

    // -------------------------
    //   GRÁFICO TIPOS DE EVENTO (BARRAS HORIZONTALES)
    // -------------------------
    const tiposMap = {};
    eventos.forEach((e) => {
        const tipo = e.tipos_eventos?.descripcion || "Sin tipo";
        tiposMap[tipo] = (tiposMap[tipo] || 0) + 1;
    });

    const tiposLabels = Object.keys(tiposMap);
    const tiposValores = Object.values(tiposMap);

    const barTiposData = {
        labels: tiposLabels,
        datasets: [
            {
                label: "Eventos",
                data: tiposValores,
                backgroundColor: PALETTE[1],
                borderRadius: 6,
            },
        ],
    };

    // -------------------------
    //   GRÁFICO EVENTOS POR MES (LÍNEA)
    // -------------------------
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const eventosPorMes = new Array(12).fill(0);

    const currentYear = new Date().getFullYear();

    eventos.forEach((e) => {
        if (!e.fecha_inicio) return;
        const fecha = new Date(e.fecha_inicio);
        if (fecha.getFullYear() !== currentYear) return;
        const mes = fecha.getMonth(); // 0-11
        eventosPorMes[mes] += 1;
    });

    const lineEventosData = {
        labels: meses,
        datasets: [
            {
                label: `Eventos ${currentYear}`,
                data: eventosPorMes,
                borderColor: PALETTE[3],
                backgroundColor: PALETTE[3] + "55",
                tension: 0.3,
                fill: true,
                pointRadius: 4,
            },
        ],
    };

    // -------------------------
    //   GRÁFICO PARTICIPACIÓN ESTIMADA VS REAL (BARRAS)
    // -------------------------
    const barParticipacionData = {
        labels: ["Participación"],
        datasets: [
            {
                label: "Estimado",
                data: [totalEstimados],
                backgroundColor: PALETTE[0],
                borderRadius: 6,
            },
            {
                label: "Real",
                data: [totalReales],
                backgroundColor: PALETTE[2],
                borderRadius: 6,
            },
        ],
    };

    const barPresupuestoData = {
        labels: ["Presupuesto"],
        datasets: [
            {
                label: "Estimado",
                data: [totalPresupuestoEstimado],
                backgroundColor: PALETTE[0],
                borderRadius: 6,
            },
            {
                label: "Real",
                data: [totalPresupuestoReal],
                backgroundColor: PALETTE[2],
                borderRadius: 6,
            },
        ],
    };


    return (
        <>
            <Cabecera onMenuClick={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="eventos-dashboard-wrapper">


                {/* MÉTRICAS RÁPIDAS */}
                <div className="eventos-metricas-grid">
                    <EventosMetricCard
                        title="Eventos registrados"
                        value={totalEventos}
                    />
                    <EventosMetricCard
                        title="En planificación"
                        value={eventosPlanificacion}
                    />
                    <EventosMetricCard
                        title="En conclusión"
                        value={eventosConclusion}
                    />
                    <EventosMetricCard
                        title="Cancelados"
                        value={eventosCancelados}
                    />
                    <EventosMetricCard
                        title="Cumplimiento de asistencia"
                        value={`${cumplimientoAsistencia}%`}
                        small
                    />
                </div>

                {/* GRID DE GRÁFICOS */}
                <div className="eventos-graficos-grid">
                    {/* Doughnut estados */}
                    <EventosChartCard title="Eventos por estado">
                        <Doughnut
                            data={doughnutEstadosData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { position: "bottom" },
                                },
                            }}
                        />
                    </EventosChartCard>

                    {/* Tipos de evento */}
                    <EventosChartCard title="Eventos por tipo">
                        <Bar
                            data={barTiposData}
                            options={{
                                indexAxis: "y", // 🔥 barras horizontales
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                },
                                scales: {
                                    x: { beginAtZero: true },
                                },
                            }}
                        />
                    </EventosChartCard>

                    {/* Eventos por mes (línea) */}
                    <EventosChartCard title={`Eventos por mes (${currentYear})`}>
                        <Line
                            data={lineEventosData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { position: "bottom" },
                                },
                                scales: {
                                    y: { beginAtZero: true, ticks: { stepSize: 1 } },
                                },
                            }}
                        />
                    </EventosChartCard>

                    {/* Participación estimada vs real */}
                    <EventosChartCard title="Participación estimada vs real">
                        <Bar
                            data={barParticipacionData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { position: "bottom" },
                                },
                                scales: {
                                    y: { beginAtZero: true },
                                },
                            }}
                        />
                    </EventosChartCard>

                    <EventosChartCard title="Presupuesto estimado vs real">
                        <Bar
                            data={barPresupuestoData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { position: "bottom" },
                                },
                                scales: {
                                    y: { beginAtZero: true },
                                },
                            }}
                        />
                    </EventosChartCard>
                </div>
            </div>
        </>

    );
}

/* TARJETA DE MÉTRICA */
function EventosMetricCard({ title, value, small = false }) {
    return (
        <div className="eventos-metric-card">
            <p className="eventos-metric-title">{title}</p>
            <h3 className={`eventos-metric-value ${small ? "eventos-metric-value-small" : ""}`}>
                {value}
            </h3>
        </div>
    );
}

/* TARJETA DE GRÁFICO */
function EventosChartCard({ title, children }) {
    return (
        <div className="eventos-chart-card">
            <h2 className="eventos-chart-title">{title}</h2>
            <div className="eventos-chart-content">{children}</div>
        </div>
    );
}
