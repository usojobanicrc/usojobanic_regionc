// src/pages/Mision.jsx
import React from 'react';
import '../css/Mision.css';
import Header from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/Button';
import Fondo from '../components/Fondo';

const Mision = () => {
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

        {/* Sección de Misión */}
        <div className="containermision"> 
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
      </div>
      <Footer />
    </>
  );
};

export default Mision;