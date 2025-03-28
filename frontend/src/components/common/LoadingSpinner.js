import './LoadingSpinner.css';

const LoadingSpinner = ({ fullPage = false }) => {
  return (
    <div className={`loading-spinner ${fullPage ? 'full-page' : ''}`}>
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;