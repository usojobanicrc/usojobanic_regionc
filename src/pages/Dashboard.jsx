// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import Cabecera from "../components/Cabecera";
import { Footer } from "../components/Footer";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  FaCalendarAlt,
  FaUsers,
  //FaExclamationCircle,
  FaChurch,
  FaBoxOpen,
  FaFileAlt,
} from "react-icons/fa";
import "../css/Dashboard.css";
import { supabase } from "../utils/supabaseClient";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// const sampleChartData = {
//   labels: ["E", "F", "M", "A", "M", "J"],
//   datasets: [
//     {
//       label: "Métricas",
//       data: [50, 60, 70, 80, 90, 100],
//       borderColor: "#f29a2e",
//       backgroundColor: "rgba(242, 154, 46, 0.2)",
//       tension: 0.3,
//       borderWidth: 2,
//       pointRadius: 0,
//     },
//   ],
// };

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // AQUÍ ES donde deben ir los hooks
  const [stats, setStats] = useState({
    eventosActivos: 0,
    eventosConcluidos: 0,
    eventosCancelados: 0,
    asistenciaPromedio: 0,
    alertas: 0,
    iglesiasPorCircuito: {},
    totalIglesias: 0,
    totalInventario: 0,
    topValiosos: [],
    totalDocumentos: 0,
  });

  //CARGAR ESTADÍSTICAS
  useEffect(() => {
    const loadStats = async () => {
      // 1️. Eventos activos
      const { data: evActivos } = await supabase
        .from("eventos")
        .select("id")
        .eq("estado_evento", "Planificacion");

      const activos = Array.isArray(evActivos) ? evActivos.length : 0;

      // 1.2️. Eventos concluidos
      const { data: evConcluidos } = await supabase
        .from("eventos")
        .select("id")
        .eq("estado_evento", "Conclusion");

      const concluidos = Array.isArray(evConcluidos) ? evConcluidos.length : 0;

      // 1.3️. Eventos cancelados
      const { data: evCancelados } = await supabase
        .from("eventos")
        .select("id")
        .eq("estado_evento", "Cancelado");

      const cancelados = Array.isArray(evCancelados) ? evCancelados.length : 0;

      // 2️. Asistencia promedio
      const { data: eventosConclusion } = await supabase
        .from("eventos")
        .select("participantes_reales")
        .eq("estado_evento", "Conclusion");

      let asistenciaPromedio = 0;

      if (Array.isArray(eventosConclusion) && eventosConclusion.length > 0) {
        const totalAsist = eventosConclusion.reduce(
          (acc, e) => acc + (e.participantes_reales || 0),
          0
        );
        asistenciaPromedio = Math.round(totalAsist / eventosConclusion.length);
      }

      // 3️. Alertas de inventario bajo
      const { data: inventario } = await supabase
        .from("inventario")
        .select("cantidad_disponible");

      const alertas = Array.isArray(inventario)
        ? inventario.filter((i) => i.cantidad_disponible < 3).length
        : 0;

         // 7️⃣ Objetos más valiosos (Top 3 por precio)
      const { data: topValiosos } = await supabase
        .from("inventario")
        .select("nombre_articulo, precio_compra")
        .order("precio_compra", { ascending: false })
        .limit(3);


      // 4️. Iglesias agrupadas por circuito
      const { data: iglesiasXCircuito } = await supabase
        .from("iglesias")
        .select(
          `
    circuito_id,
    circuito:circuitos ( nombre )
  `
        )
        .order("circuito_id", { ascending: true });

      let iglesiasPorCircuito = {};

      iglesiasXCircuito?.forEach((item) => {
        const nombre = item.circuito?.nombre || "Sin circuito";
        iglesiasPorCircuito[nombre] = (iglesiasPorCircuito[nombre] || 0) + 1;
      });

      // ✅ NECESARIO: contar total de iglesias
      const totalIglesias = Array.isArray(iglesiasXCircuito)
        ? iglesiasXCircuito.length
        : 0;

      // 5️⃣ Inventario total
      const { data: inventarioTotal } = await supabase
        .from("inventario")
        .select("id");

      const totalInventario = Array.isArray(inventarioTotal)
        ? inventarioTotal.length
        : 0;

      // 6️⃣ Documentos
      const { data: documentos } = await supabase
        .from("documentos")
        .select("id");

      const totalDocumentos = Array.isArray(documentos) ? documentos.length : 0;

      // Guardar todo
      setStats({
        eventosActivos: activos,
        eventosConcluidos: concluidos,
        eventosCancelados: cancelados,
        asistenciaPromedio,
        alertas,
        iglesiasPorCircuito,
        totalIglesias,
        totalInventario,
        topValiosos: topValiosos || [],
        totalDocumentos,
      });
    };

    loadStats();
  }, []);

  //CARGA DE USUARIO (NORMAL)
  useEffect(() => {
    const loadUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;

      if (!session) return setLoading(false);

      const email = session.user.email;

      const { data: perfil } = await supabase
        .from("usuarios")
        .select("id, nombre, apellido")
        .eq("correo", email)
        .single();

      if (!perfil) return setLoading(false);

      const { data: relacion } = await supabase
        .from("usuarios_roles")
        .select("roles(nombre_rol)")
        .eq("usuario_id", perfil.id)
        .single();

      setUser({
        nombre: perfil.nombre,
        apellido: perfil.apellido,
        rol_asignado: relacion?.roles?.nombre_rol ?? "Sin rol",
      });

      setLoading(false);
    };

    loadUser();
  }, []);

  if (loading) return null;

  // 📊 1) Eventos activos — grafiquita de barras simple
  const chartEventosActivos = {
    labels: ["Planificados", "Concluidos", "Cancelados"],
    datasets: [
      {
        label: "Eventos",
        data: [
          stats.eventosActivos,
          stats.eventosConcluidos,
          stats.eventosCancelados,
        ],
        backgroundColor: [
          "rgba(242, 154, 46, 0.6)", // planificados
          "rgba(46, 204, 113, 0.6)", // concluidos verde
          "rgba(231, 76, 60, 0.6)", // cancelados rojo
        ],
        borderColor: ["#f29a2e", "#2ecc71", "#e74c3c"],
        borderWidth: 1,
      },
    ],
  };

  // 📊 2) Asistencia promedio — donut (0% a 100%)
  const donutData = {
    labels: ["Asistencia promedio", "Restante"],
    datasets: [
      {
        data: [stats.asistenciaPromedio, 100 - stats.asistenciaPromedio],
        backgroundColor: ["#f29a2e", "#ffe3c4"],
        hoverBackgroundColor: ["#f29a2e", "#ffd7a2"],
        borderWidth: 0,
      },
    ],
  };

  // 📊 7) Top 3 objetos más valiosos
      const chartTopValiosos = {
        labels: stats.topValiosos.map((item) => item.nombre_articulo),
        datasets: [
          {
            label: "Precio de compra",
            data: stats.topValiosos.map((item) => item.precio_compra),
            backgroundColor: [
              "rgba(155, 89, 182, 0.6)",
              "rgba(52, 152, 219, 0.6)",
              "rgba(46, 204, 113, 0.6)",
            ],
            borderColor: [
              "#9b59b6",
              "#3498db",
              "#2ecc71",
            ],
            borderWidth: 1,
          },
        ],
      };

  // 📊 4) Iglesias registradas — polar area (ideal para cantidades)
  const chartIglesias = {
    labels: Object.keys(stats.iglesiasPorCircuito || {}),
    datasets: [
      {
        label: "Iglesias por circuito",
        data: Object.values(stats.iglesiasPorCircuito || {}),
        backgroundColor: [
          "#74b9ff",
          "#55efc4",
          "#a29bfe",
          "#fab1a0",
          "#ffeaa7",
        ],
        borderWidth: 1,
      },
    ],
  };

  // 📊 5) Inventario total — radar (para cantidades únicas)
  const chartInventario = {
    labels: ["Disponible", "Faltante"],
    datasets: [
      {
        data: [stats.totalInventario, Math.max(100 - stats.totalInventario, 0)],
        backgroundColor: ["#2ecc71", "#ecf0f1"],
        borderWidth: 0,
      },
    ],
  };

  // 📊 6) Documentos — pie chart
  const chartDocumentos = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        data: [1, 2, 3, 4, 5, stats.totalDocumentos],
        borderColor: "#9b59b6",
        backgroundColor: "rgba(155, 89, 182, 0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  return (
    <>
      <Cabecera onMenuClick={toggleSidebar} user={user} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`dashboard-content ${isSidebarOpen ? "sidebar-open" : ""}`}
      >
        <section className="hero-section">
          <div className="hero-overlay">
            <h1 className="hero-title">USOJOBANIC REGIÓN CENTRAL 2025</h1>
            <p className="hero-subtitle">Planifica, organiza y deja legado</p>
          </div>
        </section>

        <section className="dashboard-cards-section">
          <div className="dashboard-grid">
            <DashboardCard
              title="Eventos activos"
              icon={<FaCalendarAlt />}
              value={`${stats.eventosActivos} activos`}
              description={`Concluidos: ${stats.eventosConcluidos} | Cancelados: ${stats.eventosCancelados}`}
              chartData={chartEventosActivos}
              chartType="bar"
            />

            <DashboardCard
              title="Asistencia promedio"
              icon={<FaUsers />}
              value={`${stats.asistenciaPromedio}%`}
              description="Basado en eventos concluidos"
              chartData={donutData}
              chartType="doughnut"
            />

            <DashboardCard
              title="Objetos más valiosos"
              icon={<FaBoxOpen />}
              value="Top 3"
              description="Recursos de mayor costo"
              chartData={chartTopValiosos}
              chartType="bar"
            />

            <DashboardCard
              title="Iglesias participantes"
              icon={<FaChurch />}
              value={`${stats.totalIglesias} iglesias`}
              description="Distribución por circuitos"
              chartData={chartIglesias}
              chartType="bar" // ← gráfico de barras
            />

            <DashboardCard
              title="Inventario disponible"
              icon={<FaBoxOpen />}
              value={`${stats.totalInventario} recursos`}
              description="Registrado en plataforma"
              chartData={chartInventario}
              chartType="doughnut"
            />

            <DashboardCard
              title="Documentos subidos"
              icon={<FaFileAlt />}
              value={`${stats.totalDocumentos} archivos`}
              description="Actas, planillas y más"
              chartData={chartDocumentos}
              chartType="line"
            />
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Dashboard;
