import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Button } from "../components/Button";
import Fondo from "../components/Fondo";
import "../css/Home.css";
import { Footer } from "../components/Footer";
const Home = () => {
  //constante para navigate
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/juntadirectiva");
  };
  
  //Agregando navigate para iglesias pero aun no hay pagina para las iglesias al publico
  const handleChurchClick = () => {
    navigate("/iglesias-publicas");
  };

  const handeleventosClick = () => {
    navigate("/eventos-publicos")
  }


  return (
    <>
      <Header />
      <div className="containerhometodo">
        <div className="containercosasheader">
          <Fondo />

          <Button name="Proximos Eventos" onClick={handeleventosClick} className="boton-superpuestofondo" />
        </div>

        <div className="containerversiculos">
          <div class="logonaranjausojobanic"></div>
          <div class="versiculo">
            <p className="versiculoparrafo">Juan 11:25 </p>
            <p className="versiculoparrafo">
              25 Les dijo Jesús: Yo soy la resurrección y la vida; el
            </p>
            <p className="versiculoparrafo">
              {" "}
              que cree en mí, aunque esté muerto, vivirá.
            </p>
          </div>
          <div class="logoconvencionbautista"></div>
        </div>

        <div className="containerconocenos">
          <div class="contenedorTexto">
            <h1 class="tituloconocenos">
              “Donde la fe y la juventud se encuentran”
            </h1>
            <p class="parrafoconocenos">
              La Unión de Sociedades de Jóvenes Bautistas de Nicaragua
              (USOJOBANIC), es un Ministerio de la Convención Bautista de
              Nicaragua (CBN) de carácter no lucrativo y voluntario, conformado
              por Sociedades de Jóvenes Bautistas de Nicaragua para la
              proclamación del evangelio de Jesucristo.
            </p>

            <Button name="Conoce Más" />
          </div>

          <div class="contenedorimagen"></div>
        </div>

        <div class="contenedorlinkscards">
          <div class="tarjeta tarjeta-futbol">
            <img src="/image eventos.png" alt="" />
            <Button 
            name="Eventos" 
            className="boton-superpuesto" 
            onClick={handeleventosClick}
            />
          </div>

          <div class="contenedorderechalinkscard">
            <div class="tarjeta tarjeta-iglesias">
              <img src="/imageniglesias.png" alt="" />
              <Button
                name="Iglesias"
                className="boton-superpuesto"
                onClick={handleChurchClick}
              />
            </div>

            <div class="tarjeta tarjeta-junta">
              <img src="imagenjuntadirectiva.png" alt="" />
              <Button
                name="Junta Directiva"
                className="boton-superpuesto"
                onClick={handleLoginClick}
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
