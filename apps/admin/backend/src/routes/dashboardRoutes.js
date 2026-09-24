const express = require('express');
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

const router = express.length ? express.Router() : express.Router; // safe way just in case
const r = express.Router();

r.get('/stats', protect, getDashboardStats);

module.exports = r;
