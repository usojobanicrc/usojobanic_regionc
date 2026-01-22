import React, { useEffect, useState } from "react";
import { supabase } from '../utils/supabaseClient';
import Sidebar from '../components/Sidebar';
import Cabecera from '../components/Cabecera';

// Gráficos Chart.js
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

import "../css/HistorialParticipacion.css"; // IMPORTANTE: tu CSS externo

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

// 🎨 PALETA OFICIAL
const PALETTE = ["#ffc300", "#ff5733", "#c70039", "#900c3e", "#571845"];

export default function HistorialParticipacion() {
    const [iglesias, setIglesias] = useState([]);
    const [asistenciaPorIglesia, setAsistenciaPorIglesia] = useState([]);
    const [porCircuito, setPorCircuito] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setLoading(true);

        const { data: iglesiasData } = await supabase
            .from("iglesias")
            .select("id, nombre, circuitos(nombre)");

        const { data: eventosIglesias } = await supabase
            .from("eventos_iglesias")
            .select("iglesia_id, asistencia");

        const asistenciaAgrupada = iglesiasData.map((iglesia) => {
            const total = eventosIglesias
                ?.filter((e) => e.iglesia_id === iglesia.id)
                .reduce((sum, e) => sum + (e.asistencia || 0), 0);

            return { name: iglesia.nombre, total };
        });

        const circuitoMap = {};
        iglesiasData.forEach((iglesia) => {
            const circuito = iglesia.circuitos?.nombre || "Sin circuito";
            if (!circuitoMap[circuito]) circuitoMap[circuito] = 0;

            const total = eventosIglesias
                ?.filter((e) => e.iglesia_id === iglesia.id)
                .reduce((sum, e) => sum + (e.asistencia || 0), 0);

            circuitoMap[circuito] += total;
        });

        const circuitoArray = Object.entries(circuitoMap).map(([name, total]) => ({
            name,
            total,
        }));

        setIglesias(iglesiasData);
        setAsistenciaPorIglesia(asistenciaAgrupada);
        setPorCircuito(circuitoArray);
        setLoading(false);
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    if (loading)
        return <p className="text-center mt-10 text-gray-500">Cargando datos...</p>;

    return (

        <>
            <Cabecera onMenuClick={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="dashboard-wrapper">

                

                <div className="metricas-grid">
                    <MetricCard title="Iglesias registradas" value={iglesias.length} icon="⛪" />
                    <MetricCard
                        title="Asistencia total"
                        value={asistenciaPorIglesia.reduce((s, i) => s + i.total, 0)}
                        icon="👥"
                    />
                </div>

                <div className="graficos-grid">

                    <ChartCard title="Asistencia por iglesia">
                        <Bar
                            data={{
                                labels: asistenciaPorIglesia.map((i) => i.name),
                                datasets: [
                                    {
                                        label: "Asistentes",
                                        data: asistenciaPorIglesia.map((i) => i.total),
                                        backgroundColor: PALETTE[1],
                                        borderRadius: 8,
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                            }}
                        />
                    </ChartCard>

                    <ChartCard title="Distribución por circuito">
                        <Pie
                            data={{
                                labels: porCircuito.map((c) => c.name),
                                datasets: [
                                    {
                                        data: porCircuito.map((c) => c.total),
                                        backgroundColor: PALETTE,
                                        borderWidth: 2,
                                        borderColor: "#fff",
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                            }}
                        />
                    </ChartCard>

                </div>
            </div>
        </>

    );
}

/* COMPONENTES */
function MetricCard({ title, value, icon }) {
    return (
        <div className="metric-card">
            <div className="metric-header">
                <span className="metric-icon">{icon}</span>
                <p className="metric-title">{title}</p>
            </div>
            <h3 className="metric-value">{value}</h3>
        </div>
    );
}

function ChartCard({ title, children }) {
    return (
        <div className="chart-card">
            <h2 className="chart-title">{title}</h2>
            <div className="chart-content">
                {children}
            </div>
        </div>
    );
}
