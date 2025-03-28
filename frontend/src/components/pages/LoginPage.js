import AuthForm from '../components/auth/AuthForm';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const LoginPage = () => {
  const { user, login } = useAuth();

  if (user) {
    return <Navigate to="/" />;
  }

  const handleLogin = async (credentials) => {
    return login(credentials);
  };

  return (
    <div className="login-page">
      <AuthForm type="login" onSubmit={handleLogin} />
    </div>
  );
};

export default LoginPage;