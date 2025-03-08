import { Navigate, useParams ,useLocation} from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const TokenProtectedRoute = ({ children }) => {
  const { token } = useParams(); // Extract token (OTP) from URL
  const [isValidToken, setIsValidToken] = useState(null);
  const location = useLocation(); // Use useLocation to get navigation state
  const email = location.state?.email || '';

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Use the email from navigation state if needed; for now, assume OTP is enough
        console.log(token);
        console.log(window.history.state.user?.email);
        
        
        const response = await axios.post('http://localhost:9090/api/public/verify-otp', {
          otp: token, // Send OTP as payload
          email: email, // Access email from navigation state (optional)
        });
        if (response.data === 'OTP verified successfully') { // Adjust based on your backend response
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
        }
      } catch (error) {
        setIsValidToken(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setIsValidToken(false);
    }
  }, [token]);

  if (isValidToken === null) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return isValidToken ? children : <Navigate to="/login" replace />;
};

export default TokenProtectedRoute;