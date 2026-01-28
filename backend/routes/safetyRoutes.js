const express = require('express');
const router = express.Router();
const { getSafetyRisk } = require('../controllers/safetyController');

router.post('/check', getSafetyRisk);

module.exports = router;