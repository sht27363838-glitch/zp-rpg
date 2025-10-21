import React, { useEffect, useState } from 'react'
import axios from 'axios'
import HudCard from '../components/HudCard'
import QuestList from '../components/QuestList'

// 같은 도메인의 서버리스 API 사용
const API = '' 

export default function App(){
  const [hud, setHud] = useState(null)
  const [quests, setQuests] = useState([])
  const [loading, setLoading] = useState(true)

  async function load(){
    const [hudRes, qRes] = await Promise.all([
      axios.get(`/api/player/player-1/hud`),
      axios.get(`/api/quests`)
    ])
    setHud(hudRes.data)
    setQuests(qRes.data)
    setLoading(false)
  }

  async function complete(id){
    await axios.post(`/api/quests/${id}/complete`)
    await load()
  }

  useEffect(()=>{ load() }, [])

  if(loading) return <div style={{padding:20}}>Loading…</div>

  return (
    <div style={{display:'grid', gap:16, padding:16}}>
      <HudCard player={hud.player} kpi={hud.kpi} />
      <QuestList quests={quests} onComplete={complete} />
    </div>
  )
}
