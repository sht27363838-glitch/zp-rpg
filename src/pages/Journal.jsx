import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Journal(){
  const [rows, setRows] = useState([]);
  useEffect(()=>{ (async ()=>{ const r = await axios.get('/api/journal'); setRows(r.data || []); })(); }, []);
  return (
    <div className="page">
      <div className="panel">
        <div className="panel-title">Activity Log · Journal</div>
        <div className="list">
          {rows.map(r=>(
            <div className="row" key={r.id}>
              <div>{r.created_at.slice(0,10)}</div>
              <div>{r.quest}</div>
              <div>+{r.xp_awarded} xp · +{r.coins_awarded} c</div>
            </div>
          ))}
          {!rows.length && <div className="empty">No logs</div>}
        </div>
      </div>
    </div>
  );
}
