// src/pages/App.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Home from "./Home";
import Rewards from "./Rewards";
import Journal from "./Journal";
import HudCard from "../components/HudCard";
import QuestList from "../components/QuestList";
import ErrorBoundary from "../components/ErrorBoundary";

export default function App(){
  const [hud, setHud] = useState(null);
  const [quests, setQuests] = useState([]);
  const [tab, setTab] = useState("today");
  const [loading, setLoading] = useState(true);
  const [fatal, setFatal] = useState(null);

  async function load(){
    try {
      const [hudRes, qRes] = await Promise.allSettled([
        axios.get("/api/player/player-1/hud"),
        axios.get("/api/quests")
      ]);

      const hudData = hudRes.status === "fulfilled" ? hudRes.value.data : null;
      const questData = qRes.status === "fulfilled" ? qRes.value.data : [];

      // 최소 형태라도 만들어 HUD가 항상 렌더되게
      setHud(hudData ?? { player: { name: "Player One", total_xp: 0, coins: 0, coins_spent: 0 }, kpi: {} });
      setQuests(Array.isArray(questData) ? questData : []);
      setFatal(null);
    } catch (e) {
      setFatal(`Boot API failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{ load(); }, []);

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}


