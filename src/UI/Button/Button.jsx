import Style from './Button.module.css'
import React from 'react';



export default function Button({ width, color, label, onClick }) {
  return (
    <button
      style={{
        width: width,
        backgroundColor: color,
        color: "#fff",
        padding: "10px 20px",
        border: "none",
        borderRadius: "8px",
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
