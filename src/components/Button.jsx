import React from 'react'
import '../css/Button.css'

export const Button = ({ name, icon, onClick, className }) => {
  return (
    <button type="button" className={`btn-log ${className}`} onClick={onClick}> {icon} {name}</button>
  )
}
