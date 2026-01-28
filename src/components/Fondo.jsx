import "../css/Fondo.css";
import React from "react";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";

const Fondo = () => {
  const navigate = useNavigate();

  const handeleventosClick = () => {
    navigate("/eventos-publicos");
  };

  return (
    <div className="containerfondocomponent">
      <div className="texto">
        <p className="textoprincipal">
          Llevando la luz de cristo a la nueva generación
        </p>
      </div>

      <div className="boton">
        <Button
          name="Proximos Eventos"
          onClick={handeleventosClick}
          className="boton-superpuestofondo"
        />
      </div>
    </div>
  );
};

export default Fondo;
