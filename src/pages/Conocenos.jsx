import React, { useState } from "react";
import "../css/Conocenos.css";
import Header from "../components/Header";
import { Footer } from "../components/Footer";
import Fondo from '../components/Fondo';
import presi from "../img/Prisilla_perfil.jpeg"
import vice from '../img/Allan_perfil.jpg'
import secre from '../img/Madeling_perfil.jpg'
import vocal from '../img/Angie_perfil.jpg'
import vocal2 from '../img/Steven_perfil.jpg'
import pdefault from '../img/usojobanicB.png'
import conse from '../img/Naza_perfil.jpeg'

// Juntas directivas
const juntas = {
  "2024-2026": [
    { nombre: "Nombre Apellido", cargo: "Presidente(a)", foto: presi },
    { nombre: "Nombre Apellido", cargo: "Vicepresidente", foto: vice },
    { nombre: "Nombre Apellido", cargo: "Secretario(a)", foto: secre },
    { nombre: "Nombre Apellido", cargo: "Tesorero(a)", foto: pdefault },
    { nombre: "Nombre Apellido", cargo: "Vocal", foto: vocal },
    { nombre: "Nombre Apellido", cargo: "Vocal", foto: vocal2 },
    { nombre: "Nombre Apellido", cargo: "Consejero(a)", foto: conse },
  ],
  "2022-2024": Array(7).fill({
    nombre: "Nombre Apellido",
    cargo: "Cargo",
    foto: "/perfil.jpg",
  }),
  "2020-2022": Array(7).fill({
    nombre: "Nombre Apellido",
    cargo: "Cargo",
    foto: "/perfil.jpg",
  }),
  "2017-2020": Array(7).fill({
    nombre: "Nombre Apellido",
    cargo: "Cargo",
    foto: "/perfil.jpg",
  }),
};

// Circuitos
const circuitos = [
  { nombre: "Primer Circuito", iglesias: ["Iglesia 1", "Iglesia 2", "Iglesia 3"] },
  { nombre: "Segundo Circuito", iglesias: ["Iglesia 1", "Iglesia 2"] },
  { nombre: "Tercer Circuito", iglesias: ["Iglesia 1", "Iglesia 2"] },
  { nombre: "Cuarto Circuito", iglesias: ["Iglesia 1", "Iglesia 2"] },
  { nombre: "Quinto Circuito", iglesias: ["Iglesia 1", "Iglesia 2"] },
  { nombre: "Sexto Circuito", iglesias: ["Iglesia 1", "Iglesia 2"] },
  { nombre: "Séptimo Circuito", iglesias: ["Iglesia 1", "Iglesia 2"] },
  { nombre: "Octavo Circuito", iglesias: ["Iglesia 1", "Iglesia 2"] },
];

// Principios
const principios = [
  {
    titulo: "Principio Nº 1: El señorio de Jesucristo",
    descripcion: "La iglesia reconoce la autoridad de Jesucristo a partir de sus enseñanzas y de la causa del reino de  Dios que él ha predicado. Por eso la iglesia debe obedecer los mandamientos de Jesús de  Nazaret que ha dejado en los evangelios y a través de sus apóstoles.",
    base: "Bases bíblicas:  Juan 3,13; Hechos 2,36; Filipenses 2,1-11; Col 2, 8-15; Apocalipsis 17,14,19,16.",
  },
  {
    titulo: "Principio Nº 2: La Biblia es la única y suprema regla de fe y práctica",
    descripcion: "La Biblia es nuestra única autoridad en asuntos de fe y conducta. Inspirada por Dios, nos enseña cómo vivir, orar y seguir a Cristo en todos los aspectos de la vida.",
    base: "Jn 5,39; 2 Tim 3,15-17. Pe. 1:19-21",
  },
  {
    titulo: "Principio Nº 3:  La Iglesia está compuesta de creyentes convertidos y bautizados por  inmersión en nombre del Padre, del Hijo y del Espíritu Santo.",
    descripcion: "La iglesia está compuesta por personas que han creído en Cristo, han experimentado una transformación espiritual y han sido bautizadas por inmersión en el nombre del Padre, del Hijo y del Espíritu Santo.",
    base: "Mt 28 18-20",
  },
  {
    titulo: "Principio Nº 4:  El sacerdocio de todos los creyentes",
    descripcion: "Todos los creyentes tienen acceso directo a Dios y son llamados a servirle, sin distinción de jerarquías. Cada uno tiene la responsabilidad de vivir y compartir su fe, ejerciendo un sacerdocio espiritual.",
    base: "1 Pedro 2,9; Apocalipsis 5,10; 1 Timoteo 2,5",
  },
  {
    titulo: "Principio Nº 5: La autonomía de la iglesia local.",
    descripcion: "ada iglesia bautista es autónoma y toma sus propias decisiones bajo principios congregacionales, pero mantiene unidad con otras iglesias. Las decisiones administrativas las toma la congregación, no solo el pastor o los diáconos. El culto es guiado por el pastor con apoyo de líderes, asegurando orden y respeto a la doctrina y normativas legales.",
    base: "Rom 14:17-18; Luc 9,23; Rom 14;  1 Tim 2 1-6",
  },
  {
    titulo: "Principio Nº 6: Libertad de Conciencia",
    descripcion: "Cada creyente es responsable ante Dios por sus actos. La conciencia moral es un juez interior que guía nuestras decisiones según el bien y el mal. La libertad de conciencia permite elegir ideologías y creencias basadas en la Biblia, sin imponerlas a la iglesia. Los pastores no deben hacer proselitismo político desde el púlpito, pero sí orar por las autoridades para vivir en paz, como enseña 1 Timoteo 2:1-6.",
    base: "Mt 22,21; Jn 6,15; 18,36",
  },
  {
    titulo: "Principio Nº 7: Separación de la Iglesia y el Estado",
    descripcion: "El Estado es una organización política con poderes Ejecutivo, Legislativo y Judicial. Históricamente, los gobernantes controlaban la iglesia, pero el ideal bautista es que cada iglesia sea autónoma, se sostenga por sí misma y respete las leyes. Las iglesias colaboran con el Estado en temas de bienestar común, pero deben evitar la confusión entre ambos. Los pastores deben promover la paz y respetar la diversidad política de sus miembro Las iglesias bautistas apoyan el Estado laico, promoviendo la libertad religiosa y evitando que el Estado tenga una religión oficial.",
    base: "Texto bíblico base",
  },
  {
    titulo: "Principio Nº 8: El libre examen de las escrituras (el libre examen de La Biblia)",
    descripcion: "La interpretación de la Biblia es responsabilidad de toda la comunidad, no de un grupo exclusivo. Requiere estudio, normas hermenéuticas y la guía del Espíritu Santo. Se debe considerar el contexto histórico y literario, utilizando diversas traducciones y estudios teológicos para evitar errores doctrinales.",
    base: "Jn 5,39; Hch 17,11",
  },
];

const Conocenos = () => {
  const [periodoActivo, setPeriodoActivo] = useState("2024-2026");
  const [principioAbierto, setPrincipioAbierto] = useState(null);

  return (
    <>
      <Header />
      {/* Portada */}
        <div className="containercosasheader">
          <Fondo />
        </div>
      <div className="conocenos-container">

        {/* Sección de Misión */}
        <div id="mision" className="containermision"> 
          <div className="contenedortextomision"> 
            <h1 className="titulomision">Nuestra Misión</h1> 
            <p className="parrafomision"> 
              La Unión de Sociedades de Jóvenes Bautistas de Nicaragua (USOJOBANIC), 
              es un Ministerio de la Convención Bautista de Nicaragua (CBN) que tiene 
              como misión unificar, fortalecer y organizar a las sociedades de jóvenes 
              bautistas de la región central del país, con el fin de proclamar el Evangelio 
              de Jesucristo y crear los más altos valores cristianos, éticos y humanos en 
              toda la juventud de la nación.
            </p>
          </div>
          <div className="contenedorimagenmision"></div> 
        </div>

        {/* Sección de Visión — INVERTIDA */}
        <div id="vision" className="containervision"> 
          <div className="contenedorimagenvision"></div> {/* Imagen a la izquierda */}
          <div className="contenedortextovision"> 
            <h1 className="titulovision">Nuestra Visión</h1> 
            <p className="parrafovision"> 
              Ser una organización juvenil cristiana con alto liderazgo 
              en la obra y juventud Bautista de Nicaragua con un desarrollo 
              integral basado en los valores del Reino de Dios, distinguiéndonos 
              por la unidad y guiados por el Espíritu Santo.
            </p>
          </div>
        </div>

        {/* ===== JUNTAS DIRECTIVAS ===== */}
        <section id="juntas" className="section">
            <h1>Juntas Directivas</h1>
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
        </section>

        {/* ===== CIRCUITOS ===== */}
        <section id="circuitos" className="section section-alt">
          <h1>Circuitos</h1>

          <div className="circuitos-grid">
            {circuitos.map((circuito, index) => (
              <div className="circuito-card" key={index}>
                <h2>{circuito.nombre}</h2>
                <ul>
                  {circuito.iglesias.map((iglesia, i) => (
                    <li key={i}>{iglesia}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ===== PRINCIPIOS (ACORDEÓN) ===== */}
        <section id="principios" className="section">
          <h1>Principios Bautistas</h1>

          <div className="acordeon">
            {principios.map((p, index) => (
              <div key={index} className="acordeon-item">
                <div
                  className="acordeon-titulo"
                  onClick={() =>
                    setPrincipioAbierto(
                      principioAbierto === index ? null : index
                    )
                  }
                >
                  <h3>{p.titulo}</h3>
                  <span>{principioAbierto === index ? "−" : "+"}</span>
                </div>

                {principioAbierto === index && (
                  <div className="acordeon-contenido">
                    <p>{p.descripcion}</p>
                    <strong>Base Bíblica:</strong> {p.base}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>

      <Footer />
    </>
  );
};

export default Conocenos;
