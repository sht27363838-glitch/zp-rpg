// api/journal/index.js
const { db } = require('../_db.js');

function asISODate(d) {
  try { return new Date(d).toISOString().slice(0, 10); }
  catch { return new Date().toISOString().slice(0, 10); }
}
function ensureArray(a) { return Array.isArray(a) ? a : []; }
function energyWithScore(energy = {}) {
  const morning = Number(energy.morning ?? 0);
  const noon    = Number(energy.noon ?? 0);
  const evening = Number(energy.evening ?? 0);
  const score   = Math.round(((morning + noon + evening) / 3) * 10) / 10;
  return { morning, noon, evening, score };
}

module.exports = async (req, res) => {
  try {
    // 공통 헤더
    res.setHeader('content-type', 'application/json; charset=utf-8');

    // 내부 배열 보장(초기 부팅 시 방어)
    if (!Array.isArray(db.journal_entries)) db.journal_entries = [];
    if (!Array.isArray(db.activity_log))    db.activity_log    = [];

    // Vercel에서 body가 문자열일 수 있으니 보정
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body || '{}'); } catch { body = {}; }
    }
    body = body || {};

    // ─ GET: 목록(월/일 필터)
    if (req.method === 'GET') {
      const { month, date } = req.query || {};
      let list = db.journal_entries;

      if (typeof month === 'string' && month) {
        list = list.filter(e => String(e.date || '').startsWith(month));
      } else if (typeof date === 'string' && date) {
        const d = date.slice(0, 10);
        list = list.filter(e => String(e.date || '').slice(0, 10) === d);
      }

      // 최신순 정렬
      list = [...list].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

      // 프런트가 바로 map 할 수 있도록 배열 그대로 반환
      return res.status(200).end(JSON.stringify(list));
    }

    // ─ POST: 업서트(작성/수정)
    if (req.method === 'POST') {
      const dateISO = asISODate(body.date);
      const id = body.id || `je-${dateISO}-${Date.now()}`;

      const item = {
        id,
        date: dateISO,
        moods: ensureArray(body.moods),                // ['joy','anxiety',...]
        energy: energyWithScore(body.energy),          // {morning,noon,evening,score}
        focus: Number(body.focus ?? 0),
        stress: Number(body.stress ?? 0),
        notes: body.notes || '',
        sections: {
          events:      ensureArray(body.sections?.events),
          learnings:   ensureArray(body.sections?.learnings),
          gratitude:   ensureArray(body.sections?.gratitude),
          reflections: ensureArray(body.sections?.reflections),
        }
      };

      // upsert
      const idx = db.journal_entries.findIndex(e => e.id === id);
      if (idx >= 0) db.journal_entries[idx] = item;
      else db.journal_entries.push(item);

      // 활동 로그(+5 XP는 _db 유틸이 처리 중이라면 생략 가능 — 여기서는 로그만 남김)
      db.activity_log.unshift({
        id: 'log-' + Date.now(),
        type: 'journal_saved',
        message: 'Daily Journal saved',
        xp_delta: 5, coin_delta: 0, hp_delta: 0,
        at: new Date().toISOString(),
        links: { journal_id: id }
      });

      return res.status(200).end(JSON.stringify(item));
    }

    // 허용 메서드 안내
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).end(JSON.stringify({ error: 'Method Not Allowed' }));
  } catch (e) {
    return res.status(500).end(JSON.stringify({ ok: false, where: 'journal/index', error: String(e) }));
  }
};

