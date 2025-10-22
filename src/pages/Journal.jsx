// src/pages/Journal.jsx
import { useEffect, useState } from 'react'

/** 어떤 응답이 와도 안전하게 배열로 바꿉니다. */
function toArray(v) {
  if (Array.isArray(v)) return v
  if (v && typeof v === 'object') {
    // { ok:true, items:[...] } 형태 지원
    if (Array.isArray(v.items)) return v.items
    // 혹시 객체 맵으로 올 때 대비
    return Object.values(v)
  }
  return []
}

/** 항목을 화면용으로 안전 변환 (title/detail 없을 때도 표시되게) */
function viewModel(j) {
  const date = (j.date || j.created_at || '').toString().slice(0,10)
  const title =
    j.title ||
    j.quest_name ||
    (Array.isArray(j.sections?.events) && j.sections.events[0]) ||
    'Journal'
  const detail =
    j.detail ||
    j.notes ||
    (Array.isArray(j.sections?.reflections) && j.sections.reflections[0]) ||
    ''
  const xp  = j.delta?.xp    ?? j.xp_awarded    ?? 0
  const coin= j.delta?.coins ?? j.coins_awarded ?? 0
  const hp  = j.delta?.hp    ?? 0
  return { id:j.id || `j-${date}-${Math.random()}`, date, title, detail, xp, coin, hp }
}

export default function JournalPage() {
  const [items, setItems] = useState([])      // 항상 배열
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      setLoading(true)
      setErr(null)
      const r = await fetch('/api/journal', { headers:{ 'accept':'application/json' } })
      const data = await r.json()
      const arr = toArray(data).map(viewModel)
      setItems(arr)
    } catch (e) {
      setErr(e?.message || 'failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) {
    return (
      <div className="page">
        <div className="panel">
          <div className="panel-title">Journal</div>
          <div className="empty">Loading…</div>
        </div>
      </div>
    )
  }

  if (err) {
    return (
      <div className="page">
        <div className="panel">
          <div className="panel-title">Journal</div>
          <div className="empty" style={{color:'#fca5a5'}}>{String(err)}</div>
          <div style={{padding:'8px 12px'}}>
            <button className="btn" onClick={load}>Retry</button>
          </div>
        </div>
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="page">
        <div className="panel">
          <div className="panel-title">Journal</div>
          <div className="empty">No journal entries yet.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="panel">
        <div className="panel-title">Journal</div>
        <div className="list">
          {items.map((j) => (
            <div className="row" key={j.id}>
              <div>{j.date}</div>
              <div>
                <b>{j.title}</b>
                {j.detail ? (
                  <div style={{color:'var(--muted)', fontSize:13}}>{j.detail}</div>
                ) : null}
              </div>
              <div style={{textAlign:'right'}}>
                {j.xp   ? <div>+ {j.xp} XP</div> : null}
                {j.coin ? <div>+ {j.coin} coins</div> : null}
                {j.hp   ? <div>{j.hp>0?'+':''}{j.hp} HP</div> : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

