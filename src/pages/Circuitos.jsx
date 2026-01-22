import "../css/Circuitos.css";
import Header from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/Button";
import Fondo from "../components/Fondo";
import { FcLikePlaceholder } from "react-icons/fc";

const circuitos = () => {
  const circuitos = [
    {
      nombre: "Primer Circuito",
      iglesias: [
        "Horeb",
        "Peniel",
        "Del Dios Viviente",
        "Alfa y Omega",
        "Las Colinas",
      ],
      icono: "❤️",
    },
    {
      nombre: "Segundo Circuito",
      iglesias: ["Eben-Ezer", "Monte Horeb", "Beerseba"],
      icono: <FcLikePlaceholder />,
    },
    {
      nombre: "Tercer Circuito",
      iglesias: [
        "PIB Managua",
        "Bethel",
        "San Pablo",
        "Habla Inglesa",
        "Misionera Fe y Esperanza",
        "Casa de Paz",
      ],
      icono: "🤍",
    },
    {
      nombre: "Cuarto Circuito",
      iglesias: [
        "Getsemaní",
        "Galilea",
        "Mecadonia",
        "Genezareth",
        "Nueva Jerusalén",
        "Palabras de Vida",
        "Monte de los Olivos",
        "Resurrección",
        "Betania",
        "Emanuel",
      ],
      icono: "✝️",
    },
    {
      nombre: "Quinto Circuito",
      iglesias: [
        "Sinaí",
        "PIB Emanuel",
        "Nueva Vida en Cristo",
        "Jesús es mi Pastor",
        "Huerto de Dios",
      ],
      icono: "💙",
    },
    {
      nombre: "Sexto Circuito",
      iglesias: [
        "Nueva Canaán",
        "El Líbano",
        "Redención",
        "Adonai",
        "Roca Eterna",
      ],
      icono: "💡",
    },
    {
      nombre: "Séptimo Circuito",
      iglesias: [
        "Betania Tipitapa",
        "Camino a Emaús",
        "Siloé",
        "Emanús",
        "Monte Sinaí",
        "Canaán",
        "Cristo Nuestra Roca",
        "Puertas del Cielo",
        "Jesucristo",
        "Fundamento de Fe",
        "Verbo es Acción",
        "Shalom",
      ],
      icono: "🤝",
    },
    {
      nombre: "Octavo Circuito",
      iglesias: [
        "Campamento del Espíritu",
        "Santo",
        "Betania (Veracruz)",
        "Nueva Jerusalén",
        "Emanuel (San Isidro)",
      ],
      icono: "🙏",
    },
  ];
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
            <p className="versiculoparrafo">
              25 Les dijo Jesús: Yo soy la resurrección y la vida; el
            </p>
            <p className="versiculoparrafo">
              que cree en mí, aunque esté muerto, vivirá.
            </p>
          </div>
          <div className="logoconvencionbautista"></div>
        </div>

        {/* Sección de Circuitos */}
        <div className="circuitos-container">
          <h1>Circuitos Región Central</h1>
          <div className="circuitos-grid">
            {circuitos.map((circuito, i) => (
              <div className="circuito-card" key={i}>
                <h2>{circuito.nombre}</h2>
                <ul>
                  {circuito.iglesias.map((iglesia, j) => (
                    <li key={j}>{iglesia}</li>
                  ))}
                </ul>
                <div className="icono">{circuito.icono}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default circuitos;
