import React from "react";

const skills = [
  { key:"writing", label:"Writing" },
  { key:"financial", label:"Financial" },
  { key:"learning", label:"Learning" },
  { key:"video", label:"Video Editing" },
  { key:"health", label:"Health" },
  { key:"creativity", label:"Creativity" },
];

export default function SkillMeters() {
  // 인메모리 버전: 데모용 랜덤 값 (원하시면 API로 연결)
  const val = () => Math.floor(Math.random()*80)+20;
  return (
    <div className="skill-list">
      {skills.map(s => (
        <div className="skill-row" key={s.key}>
          <div className="skill-name">{s.label}</div>
          <div className="skill-bar"><div style={{width:`${val()}%`}}/></div>
          <div className="skill-level">LV {Math.floor(Math.random()*3)+1}</div>
        </div>
      ))}
    </div>
  );
}
