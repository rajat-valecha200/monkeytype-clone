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
    enum: [15, 30],
    default: 30
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better query performance
sessionSchema.index({ userId: 1 });
sessionSchema.index({ createdAt: -1 });

// Add instance methods if needed
sessionSchema.methods.getPerformanceCategory = function() {
  return this.wpm > 70 ? 'Fast' : this.wpm < 40 ? 'Careful' : 'Balanced';
};

// Export the model properly
const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;