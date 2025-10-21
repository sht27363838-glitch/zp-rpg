import React from 'react'

export default function QuestList({ quests, onComplete }){
  return (
    <div style={{background:'#0b1220', color:'#fff', padding:16, borderRadius:12}}>
      <div style={{fontSize:18, fontWeight:700, marginBottom:8}}>Today Operations</div>
      <div style={{display:'grid', gap:8}}>
        {quests.map(q=>(
          <div key={q.id} style={{background:'#111827', padding:12, borderRadius:10, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <div style={{fontWeight:600}}>{q.name}</div>
              <div style={{opacity:.7, fontSize:12}}>impact {q.impact} • diff {q.difficulty} • type {q.type}</div>
            </div>
            <div>
              {q.status !== 'done' ? (
                <button onClick={()=>onComplete(q.id)} style={{background:'#22c55e', color:'#000', padding:'6px 10px', borderRadius:8, border:0, cursor:'pointer'}}>Complete</button>
              ) : (
                <span style={{opacity:.7}}>Done</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
