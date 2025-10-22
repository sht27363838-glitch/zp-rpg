const { db } = require('./_db.js');
module.exports = (req,res)=> res.status(200).json({ ok:true, items: db.activity_log.slice(0,50) });
