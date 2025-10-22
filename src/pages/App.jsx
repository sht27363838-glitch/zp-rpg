import React, { useEffect, useState } from "react";
import axios from "axios";
import Home from "./Home";
import HudCard from "../components/HudCard";
import QuestList from "../components/QuestList";

export default function App(){
  const [hud, setHud] = useState(null);
  const [quests, setQuests] = useState([]);
  const [tab, setTab] = useState("home");
  const [loading, setLoading] = useState(true);

  async function load(){
    try {
      const [hudRes, qRes] = await Promise.all([
        axios.get(`/api/player/player-1/hud`),
        axios.get(`/api/quests`)
      ]);
      setHud(hudRes.data);
      setQuests(qRes.data);
    } catch (e) {
      alert('API 실패: ' + (e.response?.status || e.message));
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{ load(); }, []);

  return (
    <div>
      <div className="topbar">
        <div className={`tab ${tab==='home'?'on':''}`} onClick={()=>setTab('home')}>🏠 Home</div>
        <div className={`tab ${tab==='today'?'on':''}`} onClick={()=>setTab('today')}>🗓 Today</div>
      </div>

      {loading && <div className="loading">Loading…</div>}

      {!loading && tab==='home' && <Home hud={hud} />}
      {!loading && tab==='today' &&
        <div className="page">
          <HudCard hud={hud}/>
          <div className="panel">
            <div className="panel-title">Today Operations</div>
            <QuestList quests={quests} onCompleted={load}/>
          </div>
        </div>}
    </div>
  );
}

