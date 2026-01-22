import React, { useState } from "react";
import "../css/JuntaDirectiva.css";
import Header from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/Button";
import Fondo from "../components/Fondo";
import tesorera from "../img/tesorera.jpg"
import consejera from "../img/Naza_consejera.jpg"
import vice from "../img/vice.jpg"
import secretaria from "../img/secretaria.jpg"
import presi from "../img/presi.jpg"

export default function JuntaDirectiva() {
  const [periodoActivo, setPeriodoActivo] = useState("2024-2026");

  const juntas = {
    "2024-2026": [
      {nombre: "Hna. Prisilla V. Ruiz",
        cargo: "Presidenta",
        foto: presi,},
      {nombre: "Hno. Allan Aguilar",
        cargo: "Vicepresidente",
        foto: vice,},
      {nombre: "Hna. Madeling Cabrera",
        cargo: "Secretaria",
        foto: secretaria,},
      {nombre: "Hna. Jennifer Mercado",
        cargo: "Tesorero(a)",
        foto: tesorera,},
      {nombre: "Hna. Angie Porras",
        cargo: "Vocal",
        foto: "/img/ana.jpg",},
      {nombre: "Hno. Steven Gomez",
        cargo: "Vocal",
        foto: "/img/ana.jpg",},
      {nombre: "Hna. Nazareth Mercado",
        cargo: "Consejero(a)",
        foto: consejera,},
    ],
    "2022-2024": [
      {nombre: "Hna. Prisilla Vanessa Ruiz Gonzalez",
        cargo: "Presidenta",
        foto: "presi",},
      {nombre: "Hno. Allan Aguilar",
        cargo: "Vicepresidente",
        foto: "vice",},
      {nombre: "Hna. Madeling Cabrera",
        cargo: "Secretaria",
        foto: "",},
      {nombre: "Hna. Jennifer Mercado",
        cargo: "Tesorero(a)",
        foto: "tesorera",},
      {nombre: "Hna. Angie Porras",
        cargo: "Vocal",
        foto: "/img/ana.jpg",},
      {nombre: "Hno. Steven Gomez",
        cargo: "Vocal",
        foto: "/img/ana.jpg",},
      {nombre: "Hna. Nazareth Mercado",
        cargo: "Consejero(a)",
        foto: consejera,},
    ],
    "2020-2022": [
      {nombre: "Hna. Prisilla Vanessa Ruiz Gonzalez",
        cargo: "Presidenta",
        foto: "presi",},
      {nombre: "Hno. Allan Aguilar",
        cargo: "Vicepresidente",
        foto: "vice",},
      {nombre: "Hna. Madeling Cabrera",
        cargo: "Secretaria",
        foto: "secretaria",},
      {nombre: "Hna. Jennifer Mercado",
        cargo: "Tesorero(a)",
        foto: "tesorera",},
      {nombre: "Hna. Angie Porras",
        cargo: "Vocal",
        foto: "/img/ana.jpg",},
      {nombre: "Hno. Steven Gomez",
        cargo: "Vocal",
        foto: "/img/ana.jpg",},
      {nombre: "Hna. Nazareth Mercado",
        cargo: "Consejero(a)",
        foto: "consejera",},
    ],
    "2017-2020": [
      {nombre: "Hna. Prisilla Vanessa Ruiz Gonzalez",
        cargo: "Presidenta",
        foto: "presi",},
      {nombre: "Hno. Allan Aguilar",
        cargo: "Vicepresidente",
        foto: "vice",},
      {nombre: "Hna. Madeling Cabrera",
        cargo: "Secretaria",
        foto: "secretaria",},
      {nombre: "Hna. Jennifer Mercado",
        cargo: "Tesorero(a)",
        foto: "tesorera",},
      {nombre: "Hna. Angie Porras",
        cargo: "Vocal",
        foto: "/img/ana.jpg",},
      {nombre: "Hno. Steven Gomez",
        cargo: "Vocal",
        foto: "/img/ana.jpg",},
      {nombre: "Hna. Nazareth Mercado",
        cargo: "Consejero(a)",
        foto: consejera,},
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
