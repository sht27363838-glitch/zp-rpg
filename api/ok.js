// api/ok.js
module.exports = async (req, res) => {
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.status(200).end(JSON.stringify({ ok: true, from: 'api/ok' }));
};
