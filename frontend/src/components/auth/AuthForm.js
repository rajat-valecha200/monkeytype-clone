import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';

const AuthForm = ({ type, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    try {
      const result = await onSubmit(type === 'login' ? { email, password } : { username, email, password });
      if (result.data?.token) {
        setMessage({ text: type === 'login' ? 'Login successful!' : 'Account created!', type: 'success' });
        setTimeout(() => navigate('/'), 1000);
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.error || `${type === 'login' ? 'Login' : 'Signup'} failed`, type: 'error' });
    }
  };

  return (
    <div className="auth-form-container">
      <h2>{type === 'login' ? 'Login' : 'Sign Up'}</h2>
      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}
      <form onSubmit={handleSubmit}>
        {type === 'signup' && (
          <div className="form-group">
            <label>Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
        )}
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength="6" required />
        </div>
        <button type="submit" className="submit-btn">{type === 'login' ? 'Login' : 'Sign Up'}</button>
      </form>
      <div className="auth-footer">
        {type === 'login' ? (
          <>Don't have an account? <a href="/signup">Sign up</a></>
        ) : (
          <>Already have an account? <a href="/login">Login</a></>
        )}
      </div>
    </div>
  );
};

export default AuthForm;