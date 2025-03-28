import AuthForm from '../components/auth/AuthForm';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const LoginPage = () => {
  const { user, login } = useAuth();

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="login-page">
      <AuthForm type="login" onSubmit={login} />
    </div>
  );
};

export default LoginPage;