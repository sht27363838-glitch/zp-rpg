const { db } = require('../_db.js');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const { month } = req.query; // '2025-10' 형식이면 해당 월만 필터
    const list = month
      ? db.journal_entries.filter(e => e.date.startsWith(month))
      : db.journal_entries;
    return res.status(200).json({ ok:true, items:list });
  }
  if (req.method === 'POST') { // 일지 저장
    const body = req.body || {};
    const id = `je-${body.date?.slice(0,10) || Date.now()}`;
    const item = { id, ...body };
    // upsert
    const idx = db.journal_entries.findIndex(e=>e.id===id);
    if (idx>=0) db.journal_entries[idx] = item; else db.journal_entries.push(item);
    // 활동 로그 + 보상 XP
    db.activity_log.unshift({
      id:'log-'+Date.now(),
      type:'journal_saved',
      message:'Daily Journal saved',
      xp_delta:5, coin_delta:0, hp_delta:0,
      at:new Date().toISOString(),
    });
    return res.status(200).json({ ok:true, item });
  }
  return res.status(405).json({ ok:false, error:'Method not allowed' });
};
