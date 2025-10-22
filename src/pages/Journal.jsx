// src/pages/Journal.jsx
import { useEffect, useState } from 'react'
import { asArray } from '@/utils/asArray'

export default function JournalPage() {
  const [items, setItems] = useState([])      // 기본값 배열
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/journal')
        const data = await r.json()
        setItems(asArray(data))               // 항상 배열로 정규화
      } catch (e) {
        setErr(e?.message || 'failed to load')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <div className="page"><div className="panel"><div className="panel-title">Journal</div><div className="empty">Loading…</div></div></div>
  if (err) return <div className="page"><div className="panel"><div className="panel-title">Render Error</div><div className="empty">{String(err)}</div></div></div>

  const list = asArray(items)

  if (!list.length) {
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
          {list.map((j) => (
            <div className="row" key={j.id}>
              <div>{j.date}</div>
              <div>
                <b>{j.title}</b>
                <div style={{color:'var(--muted)', fontSize:13}}>{j.detail}</div>
              </div>
              <div style={{textAlign:'right'}}>
                {j.delta?.xp ? <div>+ {j.delta.xp} XP</div> : null}
                {j.delta?.coins ? <div>+ {j.delta.coins} coins</div> : null}
                {j.delta?.hp ? <div>{j.delta.hp>0?'+':''}{j.delta.hp} HP</div> : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
