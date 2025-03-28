const mongoose = require('mongoose');
const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wpm: {
    type: Number,
    required: [true, 'WPM is required'], 
    min: 0 
  },
  accuracy: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  totalErrors: {
    type: Number,
    required: true,
    min: 0
  },
  errorWords: [{
    type: String,
    trim: true
  }],
  typingDurations: [{
    type: Number,
    min: 0
  }],
  duration: {
    type: Number,
    required: true,
    enum: [15, 30], // Only allows 15 or 30
    default: 30 // Default value if none provided
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});