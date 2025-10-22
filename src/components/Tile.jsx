import React from "react";
export default function Tile({ icon:Icon, title, desc, href }) {
  return (
    <a className="tile" href={href}>
      <div className="tile-icon">{Icon ? <Icon size={40} strokeWidth={1.5}/> : "□"}</div>
      <div className="tile-title">{title}</div>
      <div className="tile-desc">{desc}</div>
    </a>
  );
}
