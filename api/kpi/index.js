// /api/kpi/index.js
const { db } = require('../../_db.js');

module.exports = async (_, res) => {
  try {
    res.setHeader('content-type','application/json; charset=utf-8');
    res.status(200).end(JSON.stringify({ ok:true, items: db.kpi_bridge || [] }));
  } catch (e) {
    res.status(500).end(JSON.stringify({ ok:false, error:String(e) }));
  }
};
