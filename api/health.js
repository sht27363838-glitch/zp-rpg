// api/health.js
module.exports = async (req, res) => {
  try {
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.status(200).end(JSON.stringify({ ok: true, time: new Date().toISOString() }));
  } catch (e) {
    res.status(500).end(JSON.stringify({ ok: false, error: String(e) }));
  }
};
