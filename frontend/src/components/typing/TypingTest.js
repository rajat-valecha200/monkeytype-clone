import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createSession } from '../../api';
import './TypingTest.css';

const TypingTest = () => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [timer, setTimer] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [errorWords, setErrorWords] = useState([]);
  const [typingDurations, setTypingDurations] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const lastWordTimeRef = useRef(null);

  const sampleTexts = [
    "The quick brown fox jumps over the lazy dog. This sentence contains all the letters in the English alphabet.",
    "Programming is the process of creating instructions that tell a computer how to perform tasks."
  ];

  const validateSessionData = (data) => {
    if (typeof data.wpm !== 'number' || data.wpm < 0) return 'Invalid WPM value';
    if (typeof data.accuracy !== 'number' || data.accuracy < 0 || data.accuracy > 100) return 'Invalid accuracy value';
    if (![15, 30].includes(data.duration)) return 'Duration must be 15 or 30 seconds';
    return null;
  };

  const calculateMetrics = (inputText, originalText, duration) => {
    const words = inputText.trim().split(/\s+/).filter(Boolean);
    const correctChars = [...originalText]
      .slice(0, inputText.length)
      .filter((char, i) => char === inputText[i]).length;
    
    const accuracy = Math.round((correctChars / inputText.length) * 100) || 0;
    const timeInMinutes = duration / 60;
    const wpm = Math.round((words.length / timeInMinutes) * (accuracy / 100));
    const totalErrors = inputText.length - correctChars;

    return { wpm, accuracy, totalErrors };
  };

  const startTest = (duration = 30) => {
    // Reset all state
    setText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);
    setInput('');
    setResults(null);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setErrorWords([]);
    setTypingDurations([]);
    setTimer(duration);
    setIsRunning(true);
    startTimeRef.current = new Date();
    lastWordTimeRef.current = new Date();

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Start new timer
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Focus input after state updates
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const endTest = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
  };

  const calculateResults = async () => {
    if (!input) return;

    const { wpm: calculatedWpm, accuracy: calculatedAccuracy, totalErrors } = 
      calculateMetrics(input, text, timer === 15 ? 15 : 30);

    setWpm(calculatedWpm);
    setAccuracy(calculatedAccuracy);
    setErrors(totalErrors);

    if (!user) return;

    const sessionData = {
      wpm: calculatedWpm,
      accuracy: calculatedAccuracy,
      totalErrors,
      errorWords,
      typingDurations,
      duration: timer === 15 ? 15 : 30
    };

    const validationError = validateSessionData(sessionData);
    if (validationError) {
      setResults({ error: validationError });
      return;
    }

    setIsSaving(true);
    try {
      const session = await createSession(sessionData);
      setResults(session.data);
    } catch (err) {
      console.error('Failed to save session:', err);
      setResults({ 
        error: err.response?.data?.error || 'Failed to save results. Please try again.' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e) => {
    if (!isRunning) {
      e.preventDefault();
      return;
    }
    
    const value = e.target.value;
    setInput(value);
    
    // Track error words
    const currentWordIndex = value.split(/\s+/).length - 1;
    const currentWord = text.split(/\s+/)[currentWordIndex];
    const typedWord = value.split(/\s+/)[currentWordIndex];
    
    if (currentWord && typedWord && !currentWord.startsWith(typedWord)) {
      setErrorWords(prev => 
        prev.includes(currentWord) ? prev : [...prev, currentWord]
      );
    }
    
    // Track typing durations per word
    if (value.endsWith(' ')) {
      const now = new Date();
      const duration = (now - lastWordTimeRef.current) / 1000;
      setTypingDurations(prev => [...prev, duration]);
      lastWordTimeRef.current = now;
    }
  };

  useEffect(() => {
    if (!isRunning && timer === 0) {
      calculateResults();
    }
  }, [isRunning, timer]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="typing-test">
      <h2>Typing Test</h2>
      <div className="test-mode">
        <button 
          onClick={() => startTest(15)} 
          disabled={isRunning}
        >
          15s
        </button>
        <button 
          onClick={() => startTest(30)} 
          disabled={isRunning}
        >
          30s
        </button>
      </div>
      
      <div className="timer">Time remaining: {timer}s</div>
      
      <div className="stats">
        <div>WPM: {Math.round((input.split(/\s+/).filter(Boolean).length / (30 - timer) * 60 * (accuracy / 100)) || 0)}</div>
        <div>Accuracy: {accuracy}%</div>
        <div>Errors: {errors}</div>
      </div>
      
      <div className="text-display">
        {text.split('').map((char, i) => (
          <span 
            key={i} 
            className={i < input.length ? (char === input[i] ? 'correct' : 'incorrect') : ''}
          >
            {char}
          </span>
        ))}
      </div>
      
      <textarea
        ref={inputRef}
        value={input}
        onChange={handleInputChange}
        disabled={!isRunning}
        placeholder={isRunning ? "Start typing..." : "Click start to begin"}
        readOnly={!isRunning}
      />
      
      <div className="controls">
        {!isRunning ? (
          <button onClick={() => startTest(30)}>
            Start Test
          </button>
        ) : (
          <button onClick={endTest}>
            End Test
          </button>
        )}
      </div>
      
      {isSaving && <div className="saving">Saving results...</div>}
      
      {results && (
        <div className="results">
          <h3>Results</h3>
          {results.error ? (
            <p className="error">{results.error}</p>
          ) : (
            <>
              <p>WPM: {wpm}</p>
              <p>Accuracy: {accuracy}%</p>
              <p>Errors: {errors}</p>
              {results.data && <p>Saved successfully!</p>}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TypingTest;