import React from "react";

// values: 0~1 범위 5개 (Writing, Financial, Learning, Video, Health, Creativity 중 5개 선택)
export default function Radar({ values=[.3,.5,.7,.4,.6] }) {
  const cx=120, cy=120, r=100, N=5;
  const toXY = (i, v) => {
    const angle = -Math.PI/2 + (2*Math.PI*i/N);
    return [cx + Math.cos(angle)*r*v, cy + Math.sin(angle)*r*v];
  };
  const verts = values.map((v,i)=>toXY(i, v)).map(p=>p.join(',')).join(' ');
  const grid = [1, .8, .6, .4, .2].map(g => (
    <polygon key={g} points={Array.from({length:N},(_,i)=>toXY(i,g).join(',')).join(' ')} fill="none" stroke="#233047"/>
  ));
  return (
    <svg width="240" height="240" viewBox="0 0 240 240" style={{background:'#0f1a2e', border:'1px solid #233047', borderRadius:12}}>
      <g>{grid}</g>
      <polygon points={verts} fill="rgba(14,165,233,.35)" stroke="#0ea5e9" />
    </svg>
  );
}
