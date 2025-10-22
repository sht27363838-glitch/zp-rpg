import React, { useEffect, useState } from "react";
import axios from "axios";
import Home from "./Home";
import Rewards from "./Rewards";
import Journal from "./Journal";
import HudCard from "../components/HudCard";
import QuestList from "../components/QuestList";

export default function App(){
  const [hud, setHud] = useState(null);
  const [quests, setQuests] = useState([]);
  const [tab, setTab] = useState("today");        // ← 기본값 today
  const [loading, setLoading] = useState(true);
  const [fatal, setFatal] = useState(null);       // ← 오류 메시지 저장

  async function load(){
    try {
      const [hudRes, qRes] = await Promise.all([
        axios.get("/api/player/player-1/hud"),
        axios.get("/api/quests")
      ]);
      setHud(hudRes.data || null);
      setQuests(Array.isArray(qRes.data) ? qRes.data : []);
      setFatal(null);
    } catch (e) {
      const msg = `API 실패 (${e.response?.status || "network"}): ${e.response?.data?.error || e.message}`;
      setFatal(msg);
    } finally {
      setLoading(false);
    }
  }
  useEffect(()=>{ load(); }, []);

  return (
    <div>
      <div className="topbar">
        {["home","today","rewards","journal"].map(key=>(
          <div key={key}
               className={`tab ${tab===key?"on":""}`}
               onClick={()=>setTab(key)}>
            {key==="home"?"🏠 Home":key==="today"?"🗓 Today":key==="rewards"?"🛒 Rewards":"📝 Journal"}
          </div>
        ))}
      </div>

      {loading && <div className="loading">Loading…</div>}

      {!loading && fatal && (
        <div className="page">
          <div className="panel">
            <div className="panel-title">Error</div>
            <div style={{padding:12, color:"#fca5a5"}}>{fatal}</div>
            <button className="btn" onClick={()=>{ setLoading(true); load(); }}>Retry</button>
          </div>
        </div>
      )}

      {!loading && !fatal && tab==="home"    && <Home hud={hud} />}
      {!loading && !fatal && tab==="today"   && (
        <div className="page">
          <HudCard hud={hud}/>
          <div className="panel">
            <div className="panel-title">Today Operations</div>
            <QuestList quests={quests} onCompleted={load}/>
          </div>
        </div>
      )}
      {!loading && !fatal && tab==="rewards" && <Rewards onAfter={load}/>}
      {!loading && !fatal && tab==="journal" && <Journal/>}
    </div>
  );
}

