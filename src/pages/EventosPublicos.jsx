import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import Header from "../components/Header";
import { Footer } from "../components/Footer";
import "../css/Eventospublicos.css";




const EventosPublicos = () => {

    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchEventos = async () => {
            setLoading(true);

            const { data, error } = await supabase
                .from("eventos")
                .select("titulo, lugar, fecha_inicio, fecha_final, estado_evento")

            if (error) {
                console.error("Error al cargar eventos:", error);
            } else {
                setEventos(data)
            }
            setLoading(false);
        }

        fetchEventos();
    }, [])


    return (
        <>
            <Header />

            <div className="eventos-publicos-fondo">
                <div className="eventos-publicos-container">
                    <h1 className="public-title">Eventos</h1>

                    {loading && <p className="loading">Cargando eventos...</p>}

                    {!loading && eventos.length === 0 && (
                        <p className="no-events">No hay eventos disponibles.</p>
                    )}

                    <div className="cards-grid">
                        {eventos.map(ev => (
                            <div className="evento-card" key={ev.id}>

                                <div className="evento-card-body">
                                    <h2>{ev.titulo}</h2>

                                    <p className="lugar">
                                        📍 {ev.lugar || "Sin ubicación"}
                                    </p>

                                    <p className="fecha">
                                        🗓 {new Date(ev.fecha_inicio).toLocaleDateString()}
                                        {" — "}
                                        {new Date(ev.fecha_final).toLocaleDateString()}
                                    </p>

                                    <p className={`estado ${ev.estado_evento.toLowerCase()}`}>
                                        {ev.estado_evento}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>



            <Footer />

        </>


    )
}

export default EventosPublicos;