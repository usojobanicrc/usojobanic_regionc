
import React from 'react';
import logo from '../img/usojobanicB.png';
import "../css/Footer.css";

export const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="container__footer">
        {/* Sección del Logo y Descripción */}
        <div className="box__footer">
          <div className="logo">
            <img src={logo} alt="Usojobanic RC" />
          </div>
          <div className="terms">
            <p>
              La Unión de Sociedades de Jóvenes Bautistas de Nicaragua (USOJOBANIC), 
              es un Ministerio de la Convención Bautista de Nicaragua (CBN).
            </p>
          </div>
        </div>

        {/* Sección Enlaces */}
        <div className="box__footer">
          <h2>Conócenos</h2>
          <a href="#!">Quienes Somos</a>
          <a href="#!">Nuestro Misión</a>
          <a href="#!">Nuestros principios</a>
          <a href="#!">Junta Directiva</a>
        </div>

        {/* Sección Redes Sociales */}
        <div className="box__footer">
          <h2>Redes Sociales</h2>
          <a href="https://www.facebook.com/share/17f5U1CMvC/"><i className="bi bi-facebook"></i> Facebook</a>
          <a href="https://www.tiktok.com/@usojobanic.region?is_from_webapp=1&sender_device=pc"><i className="bi bi-tiktok"></i> Messenger</a>
          <a href="emailto:usojobanicrc@gmail.com"><i className="bi bi-envelope-fill"></i> Gmail</a>
          <a href="https://www.instagram.com/usojobanic_rc?igsh=MWNmcGVoaGNwbnhtZg=="><i className="bi bi-instagram"></i> Instagram</a>
        </div>
      </div>

      <div className="box__copyright">
        <hr />
        <p>Todos los derechos reservados © 2026 <b>USOJOBANIC Región Central</b></p>
      </div>
    </footer>
  );
};