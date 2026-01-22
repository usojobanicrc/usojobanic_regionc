// src/components/DashboardCard.jsx
import React from "react";

// Importar todos los tipos de gráficos SOLO UNA VEZ
import { Line, Bar, Doughnut, Pie, Radar, PolarArea } from "react-chartjs-2";

// Importar módulos de Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import "../css/DashboardCard.css";

// Registrar absolutamente todo SOLO UNA VEZ
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend
);

const DashboardCard = ({ title, icon, value, description, chartData, chartType }) => {
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  const renderChart = () => {
    if (!chartData) return <p>Cargando...</p>;

    switch (chartType) {
      case "line":
        return <Line data={chartData} options={chartOptions} />;
      case "bar":
        return <Bar data={chartData} options={chartOptions} />;
      case "doughnut":
        return <Doughnut data={chartData} options={chartOptions} />;
      case "pie":
        return <Pie data={chartData} options={chartOptions} />;
      case "polarArea":
        return <PolarArea data={chartData} options={chartOptions} />;
      case "radar":
        return <Radar data={chartData} options={chartOptions} />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <div className="card-icon">{icon}</div>
        <h3 className="card-title">{title}</h3>
      </div>

      <div className="card-body">
        <p className="card-value">{value}</p>
        <p className="card-description">{description}</p>

        <div className="card-chart-container">
          {renderChart()}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
