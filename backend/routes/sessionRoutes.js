const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createSession,
  getUserSessions,
  analyzeSession
} = require('../controllers/sessionController');

const router = express.Router();

router.use(protect);

router.post('/', createSession);
router.get('/:userId', getUserSessions);
router.get('/analysis/:sessionId', analyzeSession);

module.exports = router;