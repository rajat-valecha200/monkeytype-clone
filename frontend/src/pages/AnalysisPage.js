import AnalysisDashboard from '../components/analysis/AnalysisDashboard';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AnalysisPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="analysis-page">
      <AnalysisDashboard />
    </div>
  );
};

export default AnalysisPage;