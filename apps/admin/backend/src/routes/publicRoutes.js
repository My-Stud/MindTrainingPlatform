const express = require('express');
const { listProjects, getSession, getQuiz } = require('../controllers/publicController');

const router = express.Router();

// Public game-facing endpoints (no auth)
router.get('/projects', listProjects);
router.get('/projects/:slug/session', getSession);
router.get('/projects/:slug/quiz', getQuiz);

module.exports = router;