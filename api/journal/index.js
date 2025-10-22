// api/journal/index.js
const { db } = require('../_db.js');

function asISODate(d) {
  try { return new Date(d).toISOString().slice(0,10); }
  catch { return new Date().toISOString().slice(0,10); }
}

module.exports = async (req, res) => {
  // Vercel의 Serverless에서 body가 문자열일 수 있으니 보정
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body || '{}'); } catch { body = {}; }
  }
  body = body || {};

  if (req.method === 'GET') {
    // ?month=YYYY-MM 또는 ?date=YYYY-MM-DD 지원
    const { month, date } = req.query || {};
    let list = db.journal_entries || [];

    if (month && typeof month === 'string') {
      list = list.filter(e => (e.date || '').startsWith(month));
    } else if (date && typeof date === 'string') {
      const d = date.slice(0,10);
      list = list.filter(e => (e.date || '').slice(0,10) === d);
    }

    // 최근 것이 먼저 보이도록 정렬
    list = [...list].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    // ✅ 프런트가 바로 map 할 수 있도록 "배열 그대로" 반환
    return res.status(200).json(list);
  }

  if (req.method === 'POST') {
    const dateISO = asISODate(body.date);
    const id = body.id || `je-${dateISO}-${Date.now()}`;

    const item = {
      id,
      date: dateISO,
      moods: Array.isArray(body.moods) ? body.moods : [],
      energy: body.energy || { morning: 0, noon: 0, evening: 0, score: 0 },
      focus: Number(body.focus ?? 0),
      stress: Number(body.stress ?? 0),
      notes: body.notes || ''
    };

    // upsert
    const idx = (db.journal_entries || []).findIndex(e => e.id === id);
    if (idx >= 0) db.journal_entries[idx] = item;
    else db.journal_entries.push(item);

    // 활동 로그 및 소량 XP 보상
    db.activity_log.unshift({
      id: 'log-' + Date.now(),
      type: 'journal_saved',
      message: 'Daily Journal saved',
      xp_delta: 5, coin_delta: 0, hp_delta: 0,
      at: new Date().toISOString(),
      links: { journal_id: id }
    });

    // 생성/수정 후 단건 반환(REST 관례)
    return res.status(200).json(item);
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method Not Allowed' });
};
