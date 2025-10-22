import React from "react";

export default function Tile({ icon, title, desc, href }) {
  return (
    <a className="tile" href={href}>
      <div className="tile-icon">{icon}</div>
      <div className="tile-title">{title}</div>
      <div className="tile-desc">{desc}</div>
    </a>
  );
}
