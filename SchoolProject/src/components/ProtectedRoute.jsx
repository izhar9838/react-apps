import { useSelector,useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { logout } from '../store/authSlice';


const ProtectedRoute = ({ children }) => {
  const authStatus = useSelector(state => state.auth?.isAuthenticated);
  const userRole = useSelector(state => state.auth?.user?.role);
  const disPatch=useDispatch();
  if (!authStatus || userRole !== 'admin') {
    disPatch(logout());
    return <Navigate to="/login" replace />;
  }
  return children;
};
export default ProtectedRoute;