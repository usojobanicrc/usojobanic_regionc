// src/pages/Vision.jsx
import React from 'react';
import '../css/Vision.css';
import Header from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/Button';
import Fondo from '../components/Fondo';

const Vision = () => {
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

        {/* Sección de Visión — INVERTIDA */}
        <div className="containervision"> 
          <div className="contenedorimagenvision"></div> {/* 👈 Imagen a la izquierda */}
          <div className="contenedortextovision"> 
            <h1 className="titulovision">Nuestra Visión</h1> 
            <p className="parrafovision"> 
              Ser una organización juvenil cristiana con alto liderazgo 
              en la obra y juventud Bautista de Nicaragua con un desarrollo 
              integral basado en los valores del Reino de Dios, distinguiéndonos 
              por la unidad en la diversidad, guiados por el Espíritu Santo.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Vision;