import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './ResetPassword.css';
import Modal from '../Modal' // Import the Modal component (adjust path as needed)

function ResetPassword() {
  const { token } = useParams(); // OTP from URL
  const [otp, setOtp] = useState(token || ''); // Renamed to otp for clarity
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false); // State for modal visibility
  const [modalContent, setModalContent] = useState({ title: '', message: '', isSuccess: false });
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || ''; // Get email from navigation state

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/public/reset-password`, {
        otp: otp, // Use OTP as token
        email, // Include email in the request
        newPassword,
      });
      
      // On success, show modal instead of setting message directly
      setModalContent({
        title: 'Success',
        message: 'Password changed successfully!',
        isSuccess: true,
      });
      setModalOpen(true);
      // Delay navigation until modal is closed
    } catch (error) {
      setMessage(error.response?.data || 'Error resetting password');
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    if (modalContent.isSuccess) {
      navigate('/login'); // Navigate to login after closing success modal
    }
  };

  return (
    <div className="reset-password-container bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)]">
      <div className="reset-password-form fade-in">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={otp}
            hidden
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP from email"
            required
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
          />
          <button type="submit">Reset Password</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>

      {/* Modal Component */}
      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        title={modalContent.title}
        message={modalContent.message}
        isSuccess={modalContent.isSuccess}
      />
    </div>
  );
}

export default ResetPassword;