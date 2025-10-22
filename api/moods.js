const { db } = require('./_db.js');
module.exports = (req,res)=>{
  if (req.method==='GET') return res.status(200).json({ ok:true, items:db.moods });
  if (req.method==='POST'){
    const { name, icon } = req.body || {};
    const id = name.toLowerCase().replace(/\s+/g,'-');
    db.moods.push({ id, name, icon: icon||'🙂' });
    return res.status(200).json({ ok:true });
  }
  return res.status(405).json({ ok:false });
};
