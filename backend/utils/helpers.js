const analyzeTypingPattern = (typingDurations) => {
    const avg = typingDurations.reduce((a, b) => a + b, 0) / typingDurations.length;
    const variance = typingDurations.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / typingDurations.length;
    const stdDev = Math.sqrt(variance);
    
    return {
      averageSpeed: avg,
      consistency: stdDev < 0.5 ? 'High' : stdDev < 1 ? 'Medium' : 'Low'
    };
  };
  
  module.exports = {
    analyzeTypingPattern
  };