import AuthForm from '../components/auth/AuthForm';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const SignupPage = () => {
  const { user, signup } = useAuth();

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="signup-page">
      <AuthForm type="signup" onSubmit={signup} />
    </div>
  );
};

export default SignupPage;