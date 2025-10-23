// /api/activity/index.js
const { db } = require('../../_db.js');

module.exports = async (_, res) => {
  try {
    const items = Array.isArray(db.activity_log) ? db.activity_log : [];
    res.setHeader('content-type','application/json; charset=utf-8');
    res.status(200).end(JSON.stringify({ ok:true, items }));
  } catch (e) {
    res.status(500).end(JSON.stringify({ ok:false, error:String(e) }));
  }
};
