import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const StudentProtected = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is admin for admin routes
  if (window.location.pathname.startsWith('/student') && user?.role !== 'student') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default StudentProtected;