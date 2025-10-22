// api/quests/index.js
const { db } = require('../_db.js')

module.exports = async (req, res) => {
  try {
    // GET: 퀘스트 목록
    if (req.method === 'GET') {
      res.setHeader('content-type', 'application/json; charset=utf-8');
      return res.status(200).end(JSON.stringify(db.quests));
    }

    // POST: 새 퀘스트 추가 (JSON Body만 처리)
    if (req.method === 'POST') {
      let body = {};
      if (req.headers['content-type']?.includes('application/json')) {
        let data = '';
        for await (const chunk of req) data += chunk;
        try { body = JSON.parse(data || '{}'); } catch { body = {}; }
      }

      const id = `q_${Date.now()}`;
      const quest = { id, status: 'planned', completed_at: null, ...body };
      db.quests.push(quest);

      res.setHeader('content-type', 'application/json; charset=utf-8');
      return res.status(201).end(JSON.stringify(quest));
    }

    // 그 외 메서드
    res.status(405).end('Method Not Allowed');
  } catch (e) {
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.status(500).end(JSON.stringify({ ok: false, where: 'quests/index', error: String(e) }));
  }
};
