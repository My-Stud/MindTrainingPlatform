/**
 * Express middleware example for protecting admin routes.
 * Drop this into your Express admin panel.
 */

const VIEBRAIN_API_KEY = process.env.VIEBRAIN_API_KEY;

function requireVieBrainAuth(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== VIEBRAIN_API_KEY) {
    return res.status(401).json({ error: "Invalid or missing API key" });
  }

  next();
}

// Usage in your Express routes:
//
//   const { requireVieBrainAuth } = require('./viebrain-middleware');
//   const viebrain = require('./viebrain-api-client');
//
//   app.get('/admin/users', requireVieBrainAuth, async (req, res) => {
//     const data = await viebrain.getUsers(req.query);
//     res.json(data);
//   });

module.exports = { requireVieBrainAuth };
