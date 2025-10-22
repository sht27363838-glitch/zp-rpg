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
  const [tab, setTab] = useState("home");
  const [loading, setLoading] = useState(true);

  async function load(){
    const [hudRes, qRes] = await Promise.all([
      axios.get(`/api/player/player-1/hud`),
      axios.get(`/api/quests`)
    ]);
    setHud(hudRes.data); setQuests(qRes.data);
  }
  useEffect(()=>{ (async()=>{ try{ await load(); } finally{ setLoading(false); } })(); }, []);

  const refresh = async ()=>{ await load(); };

  return (
    <div>
      <div className="topbar">
        {['home','today','rewards','journal'].map(key=>(
          <div key={key} className={`tab ${tab===key?'on':''}`} onClick={()=>setTab(key)}>
            {key==='home'?'🏠 Home':key==='today'?'🗓 Today':key==='rewards'?'🛒 Rewards':'📝 Journal'}
          </div>
        ))}
      </div>
      {loading && <div className="loading">Loading…</div>}
      {!loading && tab==='home'    && <Home hud={hud} />}
      {!loading && tab==='today'   &&
        <div className="page">
          <HudCard hud={hud}/>
          <div className="panel">
            <div className="panel-title">Today Operations</div>
            <QuestList quests={quests} onCompleted={refresh}/>
          </div>
        </div>}
      {!loading && tab==='rewards' && <Rewards onAfter={refresh}/>}
      {!loading && tab==='journal' && <Journal/>}
    </div>
  );
}
