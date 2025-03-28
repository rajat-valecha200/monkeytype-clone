import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserSessions, getSessionAnalysis } from '../../api';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './AnalysisDashboard.css';

Chart.register(...registerables);

const AnalysisDashboard = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState({
    sessions: false,
    analysis: false
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserSessions = async () => {
      if (!user.user?._id) return;

      setLoading(prev => ({ ...prev, sessions: true }));
      setError(null);
      
      try {
        const response = await getUserSessions(user.user._id);
        setSessions(response.data.data);
        
        // Automatically select and load the first session if available
        if (response.data.length > 0) {
          setSelectedSession(response.data[0]._id);
        }
      } catch (err) {
        console.error('Failed to fetch sessions:', err);
        setError(err.response?.data?.error || 'Failed to load session history');
      } finally {
        setLoading(prev => ({ ...prev, sessions: false }));
      }
    };

    fetchUserSessions();
  }, [user]);

  useEffect(() => {
    const fetchSelectedSessionAnalysis = async () => {
      if (!selectedSession) return;

      setLoading(prev => ({ ...prev, analysis: true }));
      setError(null);

      try {
        const response = await getSessionAnalysis(selectedSession);
        setAnalysis(response.data);
      } catch (err) {
        console.error('Failed to fetch session analysis:', err);
        setError(err.response?.data?.error || 'Failed to load session analysis');
      } finally {
        setLoading(prev => ({ ...prev, analysis: false }));
      }
    };

    fetchSelectedSessionAnalysis();
  }, [selectedSession]);

  const handleSessionSelect = (sessionId) => {
    setSelectedSession(sessionId);
  };

  const wpmChartData = {
    labels: sessions.map((_, i) => `Session ${i + 1}`),
    datasets: [{
      label: 'WPM',
      data: sessions.map(s => s.wpm),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  const errorChartData = analysis?.mostErrorProneWords ? {
    labels: Object.keys(analysis.mostErrorProneWords).slice(0, 10), // Limit to top 10
    datasets: [{
      label: 'Error Frequency',
      data: Object.values(analysis.mostErrorProneWords).slice(0, 10),
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }]
  } : null;

  return (
    <div className="analysis-dashboard">
      <h2>Your Typing Analysis</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="session-history">
        <h3>Recent Sessions</h3>
        {loading.sessions ? (
          <div className="loading-spinner">Loading sessions...</div>
        ) : sessions.length > 0 ? (
          <ul>
            {sessions.map(session => (
              <li 
                key={session._id} 
                onClick={() => handleSessionSelect(session._id)}
                className={selectedSession === session._id ? 'active' : ''}
              >
                {new Date(session.createdAt).toLocaleString()} - 
                WPM: {session.wpm} - 
                Accuracy: {session.accuracy}%
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-sessions">No sessions found. Complete a typing test first.</p>
        )}
      </div>
      
      {loading.analysis ? (
        <div className="loading-spinner">Loading analysis...</div>
      ) : analysis ? (
        <div className="analysis-results">
          <div className="chart-container">
            <h3>WPM Progress</h3>
            {sessions.length > 1 ? (
              <Line 
                data={wpmChartData} 
                options={{ responsive: true }}
              />
            ) : (
              <p>Complete more tests to see WPM trends</p>
            )}
          </div>
          
          <div className="chart-container">
            <h3>Top Error Words</h3>
            {errorChartData ? (
              <Bar 
                data={errorChartData} 
                options={{ responsive: true }}
              />
            ) : (
              <p>No error data available for this session</p>
            )}
          </div>
          
          <div className="insights">
            <h3>Performance Insights</h3>
            <div className="insight-item">
              <strong>Typing Style:</strong> {analysis.wpm > 70 ? 'Fast' : analysis.wpm < 40 ? 'Careful' : 'Balanced'}
            </div>
            <div className="insight-item">
              <strong>Error Recovery:</strong> {analysis.insights?.resilience || 'Not measured'}
            </div>
            <div className="insight-item">
              <strong>Consistency:</strong> {sessions.length > 1 ? 
                (Math.max(...sessions.map(s => s.wpm)) - Math.min(...sessions.map(s => s.wpm)) < 15 ? 
                  'Consistent' : 'Variable') : 'Need more tests'}
            </div>
          </div>
        </div>
      ) : (
        !loading.sessions && sessions.length > 0 && (
          <p>Select a session to view analysis</p>
        )
      )}
    </div>
  );
};

export default AnalysisDashboard;