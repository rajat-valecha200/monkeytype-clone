import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import './MainLayout.css';

const MainLayout = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="main-layout">
      <Navbar />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;