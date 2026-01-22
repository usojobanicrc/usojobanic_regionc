import React from 'react'
import { Link } from "react-router-dom";
import logo from '../img/usojobanicB.png'
import "../css/Footer.css";

export const Footer = () => {


  return (
    <footer>
      <p class='text-center'>Union de Asociasiones Bautistas de Nicaragua
        Region Central</p>
      <div className="container__footer">
        <div className="box__footer">
          <div className="logo">
            <img src={logo} alt="Usojobanic RC" />
          </div>
        </div>

        <div className="box__footer">

          <h2>Sobre nosotros</h2>
          <a href="#!">Quienes Somos</a>
          <a href="#!">Nuestro Proposito</a>
          <Link to='/principios'>Nuestros principios</Link>
        </div>

        <div className="box__footer">

          <h2>Conoce mas</h2>
          <Link to='/juntadirectiva'>Junta Directiva</Link>
          <Link to='/circuitos'>Circuitos</Link>
          <a href="#!">Ultimos Eventos</a>
        </div>

        <div className="box__footer">
          <h2>Redes Sociales</h2>
          <div className='container-social-icons'>
            <a href="https://www.facebook.com/share/17f5U1CMvC/"><i class="bi bi-facebook social-icon"></i></a>
            <a href="https://www.tiktok.com/@usojobanic.region?is_from_webapp=1&sender_device=pc"><i class="bi bi-tiktok social-icon"></i></a>
            <a href="#!"><i class="bi bi-google social-icon"></i></a>
            <a href="https://www.instagram.com/usojobanic_rc?igsh=MWNmcGVoaGNwbnhtZg=="><i class="bi bi-instagram social-icon"></i></a>
          </div>

        </div>

      </div>

      <div className="box__copyright">
        <div className="styled-hr">
          <hr /><p>Todos los derechos reservados © 2025 <b>USOJOBANIC Región Central</b></p>
        </div>
      </div>
    </footer>
  )
}
