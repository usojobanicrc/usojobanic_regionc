import React, { useState } from "react";
import "../css/JuntaDirectiva.css";
import Header from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/Button";
import Fondo from "../components/Fondo";
import photo_default from "../img/usojobanicB.png"
import consejera from "../img/Naza_perfil.jpeg"
import vice from "../img/Allan_perfil.jpg"
import secretaria from "../img/Madeling_perfil.jpg"
import presi from "../img/Prisilla_perfil.jpeg"
import vocal1 from "../img/Steven_perfil.jpg"
import vocal2 from "../img/Angie_perfil.jpg"

export default function JuntaDirectiva() {
  const [periodoActivo, setPeriodoActivo] = useState("2024-2026");

  const juntas = {
    "2024-2026": [
      {nombre: "Hna. Prisilla V. Ruiz",
        cargo: "Presidenta",
        foto: presi,},
      {nombre: "Hno. Allan Aguilar",
        cargo: "Vice Presidente",
        foto: vice,},
      {nombre: "Hna. Madeling Cabrera",
        cargo: "Secretaria(o)",
        foto: secretaria,},
      {nombre: "Hna. Jennifer Mercado",
        cargo: "Tesorero(a)",
        foto: photo_default,},
      {nombre: "Hna. Angie Porras",
        cargo: "Vocal",
        foto: vocal2,},
      {nombre: "Hno. Steven Gomez",
        cargo: "Vocal",
        foto: vocal1,},
      {nombre: "Hna. Nazareth Mercado",
        cargo: "Consejero(a)",
        foto: consejera,},
    ],
    "2022-2024": [
      {nombre: "Hna.",
        cargo: "Presidenta",
        foto: photo_default,},
      {nombre: "Hno.",
        cargo: "Vicepresidente",
        foto: photo_default,},
      {nombre: "Hna. ",
        cargo: "Secretaria",
        foto: photo_default,},
      {nombre: "Hna.",
        cargo: "Tesorero(a)",
        foto: photo_default,},
      {nombre: "Hna.",
        cargo: "Vocal",
        foto: photo_default,},
      {nombre: "Hno.",
        cargo: "Vocal",
        foto: photo_default,},
      {nombre: "Hna.",
        cargo: "Consejero(a)",
        foto: photo_default,},
    ],
    "2020-2022": [
       {nombre: "Hna.",
        cargo: "Presidenta",
        foto: photo_default,},
      {nombre: "Hno.",
        cargo: "Vicepresidente",
        foto: photo_default,},
      {nombre: "Hna. ",
        cargo: "Secretaria",
        foto: photo_default,},
      {nombre: "Hna.",
        cargo: "Tesorero(a)",
        foto: photo_default,},
      {nombre: "Hna.",
        cargo: "Vocal",
        foto: photo_default,},
      {nombre: "Hno.",
        cargo: "Vocal",
        foto: photo_default,},
      {nombre: "Hna.",
        cargo: "Consejero(a)",
        foto: photo_default,},
    ],
    "2017-2020": [
       {nombre: "Hna.",
        cargo: "Presidenta",
        foto: photo_default,},
      {nombre: "Hno.",
        cargo: "Vicepresidente",
        foto: photo_default,},
      {nombre: "Hna. ",
        cargo: "Secretaria",
        foto: photo_default,},
      {nombre: "Hna.",
        cargo: "Tesorero(a)",
        foto: photo_default,},
      {nombre: "Hna.",
        cargo: "Vocal",
        foto: photo_default,},
      {nombre: "Hno.",
        cargo: "Vocal",
        foto: photo_default,},
      {nombre: "Hna.",
        cargo: "Consejero(a)",
        foto: photo_default,},
    ],
  };

  return (
    <>
      <Header />
      <div className="containerhometodo">
        {/* Portada */}
        <div className="containercosasheader">
          <Fondo />
          <Button name="Próximos Eventos" className="boton-superpuestofondo" />
        </div>

        {/* Versículo */}
        <div className="containerversiculos">
          <div className="logonaranjausojobanic"></div>
          <div className="versiculo">
            <p className="versiculoparrafo">Juan 11:25 </p>
            <p className="versiculoparrafo">25 Les dijo Jesús: Yo soy la resurrección y la vida; el</p>
            <p className="versiculoparrafo">que cree en mí, aunque esté muerto, vivirá.</p>
          </div>
          <div className="logoconvencionbautista"></div>
        </div>

        {/* Sección de Junta */}
        <div className="junta-container">
          <div className="tabs">
            {Object.keys(juntas).map((periodo) => (
              <button
                key={periodo}
                className={`tab ${periodoActivo === periodo ? "active" : ""}`}
                onClick={() => setPeriodoActivo(periodo)}
              >
                Junta Directiva {periodo}
              </button>
            ))}
          </div>

          <div className="miembros-grid">
            {juntas[periodoActivo].map((persona, index) => (
              <div key={index} className="card">
                <img src={persona.foto} alt={persona.nombre} />
                <div className="info">
                  <h3>{persona.nombre}</h3>
                  <p className="cargo">{persona.cargo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
