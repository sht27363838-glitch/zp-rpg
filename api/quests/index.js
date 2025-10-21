const { db } = require('../../_db.js');

async function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); }
      catch { resolve({}); }
    });
  });
}

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      res.setHeader('content-type', 'application/json; charset=utf-8');
      return res.status(200).end(JSON.stringify(db.quests));
    }
    if (req.method === 'POST') {
      const body = await readBody(req);
      const id = `q_${Date.now()}`;
      const quest = { id, status:'planned', completed_at:null, ...body };
      db.quests.push(quest);
      res.setHeader('content-type', 'application/json; charset=utf-8');
      return res.status(201).end(JSON.stringify(quest));
    }
    res.status(405).end('Method Not Allowed');
  } catch (e) {
    res.status(500).end(JSON.stringify({ ok:false, error:String(e) }));
  }
};
