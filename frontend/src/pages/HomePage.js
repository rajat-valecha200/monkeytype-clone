import TypingTest from '../components/typing/TypingTest';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const HomePage = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="home-page">
      <TypingTest />
    </div>
  );
};

export default HomePage;