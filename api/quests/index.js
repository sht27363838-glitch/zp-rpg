// api/quests/index.js
const { db } = require('../_db.js');

module.exports = async (req, res) => {
  try {
    // CORS(선택) & 공통 헤더
    res.setHeader('content-type', 'application/json; charset=utf-8');

    // ─ GET: 퀘스트 목록
    if (req.method === 'GET') {
      // 앱에서 배열을 기대하므로 그대로 배열 반환
      return res.status(200).end(JSON.stringify(db.quests));
    }

    // ─ POST: 새 퀘스트 추가 (JSON Body)
    if (req.method === 'POST') {
      let body = {};
      if (req.headers['content-type']?.includes('application/json')) {
        let raw = '';
        for await (const chunk of req) raw += chunk;
        try { body = JSON.parse(raw || '{}'); } catch { body = {}; }
      }

      // 최소 필드 보정(누락 방어)
      const id = `q_${Date.now()}`;
      const quest = {
        id,
        name: body.name || 'Untitled quest',
        type: body.type || 'task',          // 'habit' | 'task' | 'project'
        area_id: body.area_id || null,
        skill_id: body.skill_id || null,
        difficulty: Number(body.difficulty ?? 1),
        impact: Number(body.impact ?? 1),
        energy: Number(body.energy ?? 1),
        frequency: body.frequency || 'none',
        due_date: body.due_date || new Date().toISOString().slice(0, 10),
        kpi_ok: !!body.kpi_ok,
        status: 'planned',
        completed_at: null,
      };

      db.quests.push(quest);
      return res.status(201).end(JSON.stringify(quest));
    }

    // 그 외 메서드
    return res.status(405).end(JSON.stringify({ ok: false, error: 'Method Not Allowed' }));
  } catch (e) {
    return res
      .status(500)
      .end(JSON.stringify({ ok: false, where: 'quests/index', error: String(e) }));
  }
};
