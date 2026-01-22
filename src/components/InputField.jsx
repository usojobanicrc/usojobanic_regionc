import React from 'react'
import '../css/InputField.css'

export const InputField = ({icon, type = 'text', name, value, onChange, label}) => {
  return (
    <div className="input-group">
      <span className="icon-container">
        <i className={`icon ${icon}`}></i> {/* Aqui le digo que va a recibir un icono que es el nombre que le da en bootstrap */}
      </span>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={label} className="input-field" required/> 
      {/* Aqui le doy el campo donde el usaurio escribira.
      type={type} Define el tipo de campo de entrada.
      name={name} Le da un nombre al input, usado especialmente en formularios para identificarlo.
      value={value} Define el valor actual del input. En React, se usa para hacer un input controlado (React tiene el control del valor).
      onChange={onChange} Función que se ejecuta cada vez que el usuario escribe o cambia el valor del input.
      placeholder={label} Muestra un texto dentro del input cuando está vacío, como sugerencia.
      className="input-field" Aplica estilos CSS usando clases.
*/}
    </div>
  )
}

