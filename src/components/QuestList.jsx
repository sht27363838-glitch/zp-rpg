// src/components/QuestList.jsx
import React from "react";
import axios from "axios";

export default function QuestList({ quests = [], onCompleted }) {
  const list = Array.isArray(quests) ? quests : [];

  const complete = async (id) => {
    try {
      await axios.post(`/api/quests/${id}/complete`);
      onCompleted?.(); // 상위에서 HUD/목록 리로드
    } catch (e) {
      alert(e?.response?.data?.error || e.message);
    }
  };

  if (!list.length) {
    return (
      <div style={{ padding: 12, color: "var(--muted)" }}>
        No quests for today.
      </div>
    );
  }

  return (
    <div className="list">
      {list.map((q) => (
        <div className="row" key={q.id}>
          <div>{q.due?.slice?.(0, 10) || ""}</div>
          <div>
            <b>{q.name}</b>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              impact {q.impact} · diff {q.difficulty} · type {q.type}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <button className="btn" onClick={() => complete(q.id)}>
              Complete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

