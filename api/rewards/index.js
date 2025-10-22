const { db } = require('../../_db.js');

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      res.setHeader('content-type','application/json; charset=utf-8');
      return res.status(200).end(JSON.stringify({ rewards: db.rewards, redeemed: db.rewards_redeemed }));
    }
    res.status(405).end('Method Not Allowed');
  } catch (e) {
    res.status(500).end(JSON.stringify({ ok:false, where:'rewards/index', error:String(e) }));
  }
};
