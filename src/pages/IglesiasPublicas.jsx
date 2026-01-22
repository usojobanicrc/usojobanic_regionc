// src/pages/IglesiasPublicas.jsx
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import Header from "../components/Header";
import { Footer } from "../components/Footer";
import "../css/IglesiasPublicas.css";

const IglesiasPublicas = () => {
  const [circuitos, setCircuitos] = useState([]);
  const [iglesiasPorCircuito, setIglesiasPorCircuito] = useState({});
  const [activeCircuitoId, setActiveCircuitoId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Paleta de colores para los circuitos (se asigna en orden)
  const circuitoColors = [
    "#ffc300", // amarillo
    "#ff5733", // naranja
    "#c70039", // rojo
    "#900c3e", // magenta
    "#571845", // morado
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar circuitos
        const { data: circuitosData, error: circuitosError } = await supabase
          .from("circuitos")
          .select("id, nombre")
          .order("nombre", { ascending: true });

        if (circuitosError) throw circuitosError;

        setCircuitos(circuitosData || []);

        // Cargar iglesias por circuito
        const iglesiasMap = {};
        for (const circuito of circuitosData || []) {
          const { data: iglesiasData } = await supabase
            .from("iglesias")
            .select("nombre, fecha_origen")
            .eq("circuito_id", circuito.id)
            .order("nombre", { ascending: true });

          iglesiasMap[circuito.id] = iglesiasData || [];
        }

        setIglesiasPorCircuito(iglesiasMap);

        // Al cargar, activar el primer circuito
        if (circuitosData && circuitosData.length > 0) {
          setActiveCircuitoId(circuitosData[0].id);
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMouseEnterCircuito = (circuitoId) => {
    setActiveCircuitoId(circuitoId);
  };

  const handleMouseLeaveCircuito = () => {
    // No hacemos nada aquí — el panel se cierra solo si el mouse sale del área completa
  };

  const handleMouseLeavePanel = () => {
    // Mantenemos el último circuito seleccionado
  };

  const getCircuitoColor = (index) => {
    return circuitoColors[index % circuitoColors.length];
  };

  const activeCircuito = circuitos.find(c => c.id === activeCircuitoId);
  const activeIndex = circuitos.findIndex(c => c.id === activeCircuitoId);
  const activeColor = activeIndex !== -1 ? getCircuitoColor(activeIndex) : "#ffc300";

  return (
    <>
      <Header />
      <main className="iglesias-publicas-container">
        {/* Título centrado y debajo del header */}
        <h1 className="title">Iglesias por Circuito</h1>

        {loading ? (
          <div className="loading">Cargando...</div>
        ) : (
          <div className="layout">
            {/* Panel izquierdo: Circuitos */}
            <div className="circuitos-panel">
              <h2 className="panel-title">Circuitos</h2>
              <div className="circuitos-list">
                {circuitos.map((circuito, index) => (
                  <div
                    key={circuito.id}
                    className={`circuito-item ${
                      activeCircuitoId === circuito.id ? "active" : ""
                    }`}
                    style={{
                      backgroundColor: activeCircuitoId === circuito.id 
                        ? getCircuitoColor(index) 
                        : "#f8f8f8",
                      color: activeCircuitoId === circuito.id 
                        ? "#fff" 
                        : "#4b5563",
                      borderLeft: activeCircuitoId === circuito.id 
                        ? `4px solid ${getCircuitoColor(index)}` 
                        : "none"
                    }}
                    onMouseEnter={() => handleMouseEnterCircuito(circuito.id)}
                    onMouseLeave={handleMouseLeaveCircuito}
                  >
                    {circuito.nombre}
                  </div>
                ))}
              </div>
            </div>

            {/* Panel derecho: Iglesias del circuito activo */}
            <div
              className="iglesias-panel"
              onMouseLeave={handleMouseLeavePanel}
            >
              {activeCircuito ? (
                <>
                  <h2
                    className="section-title"
                    style={{
                      color: activeColor,
                      background: `linear-gradient(to right, ${activeColor}10, ${activeColor}20)`,
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      textAlign: "center"
                    }}
                  >
                    Iglesias del {activeCircuito.nombre}
                  </h2>
                  {iglesiasPorCircuito[activeCircuito.id]?.length > 0 ? (
                    <div className="iglesias-grid">
                      {iglesiasPorCircuito[activeCircuito.id].map((iglesia, index) => (
                        <div
                          key={index}
                          className="iglesia-card"
                          style={{
                            backgroundColor: "#fff",
                            borderColor: activeColor,
                            boxShadow: `0 2px 8px ${activeColor}20`
                          }}
                        >
                          <h3 className="iglesia-nombre">{iglesia.nombre}</h3>
                          <p className="iglesia-info">
                            <strong>Fundada:</strong>{" "}
                            {iglesia.fecha_origen
                              ? new Date(iglesia.fecha_origen).toLocaleDateString("es-NI")
                              : "No registrada"}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-iglesias">No hay iglesias registradas en este circuito.</p>
                  )}
                </>
              ) : (
                <div className="placeholder">
                  <p>Pasa el cursor sobre un circuito para ver sus iglesias.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default IglesiasPublicas;