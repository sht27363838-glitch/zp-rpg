const { db } = require('../../_db.js');

module.exports = async (req, res) => {
  try {
    const rows = db.journal
      .slice(-200)
      .map(j => ({ ...j, quest: db.quests.find(q=>q.id===j.quest_id)?.name || '-' }))
      .reverse();
    res.setHeader('content-type','application/json; charset=utf-8');
    res.status(200).end(JSON.stringify(rows));
  } catch (e) {
    res.status(500).end(JSON.stringify({ ok:false, where:'journal/index', error:String(e) }));
  }
};
