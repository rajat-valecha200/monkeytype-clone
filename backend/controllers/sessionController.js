const Session = require('../models/Session');

const createSession = async (req, res) => {
  try {
    // Validate required fields first
    if (typeof req.body.wpm === 'undefined') {
      throw new Error('WPM is required');
    }
    
    if (![15, 30].includes(req.body.duration)) {
      throw new Error('Duration must be either 15 or 30');
    }

    const session = new Session({
      userId: req.user._id,
      wpm: req.body.wpm,
      accuracy: req.body.accuracy,
      totalErrors: req.body.totalErrors,
      errorWords: req.body.errorWords || [],
      typingDurations: req.body.typingDurations || [],
      duration: req.body.duration // Must be 15 or 30
    });

    await session.save();
    
    res.status(201).json({
      success: true,
      data: session
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

const getUserSessions = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized access'
      });
    }
    
    const sessions = await Session.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json({
      success: true,
      data: sessions
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

const analyzeSession = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.sessionId,
      userId: req.user._id
    });
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }
    
    const errorWordsCount = session.errorWords.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});
    
    const avgTypingSpeed = session.typingDurations.reduce((a, b) => a + b, 0) / session.typingDurations.length;
    
    const firstThreeWordsAvg = session.typingDurations.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
    const lastThreeWordsAvg = session.typingDurations.slice(-3).reduce((a, b) => a + b, 0) / 3;
    
    res.json({
      success: true,
      data: {
        sessionId: session._id,
        wpm: session.wpm,
        accuracy: session.accuracy,
        totalErrors: session.totalErrors,
        mostErrorProneWords: errorWordsCount,
        averageTypingSpeed: avgTypingSpeed,
        insights: {
          typingStyle: session.wpm > 70 ? 'Fast' : session.wpm < 40 ? 'Careful' : 'Balanced',
          resilience: lastThreeWordsAvg < firstThreeWordsAvg ? 'Good recovery' : 'Struggled after errors',
          consistency: Math.max(...session.typingDurations) - Math.min(...session.typingDurations) < 2 ? 'Consistent' : 'Variable'
        }
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

module.exports = {
  createSession,
  getUserSessions,
  analyzeSession
};