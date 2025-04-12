import { createSlice } from "@reduxjs/toolkit";
const channel = new BroadcastChannel('auth_channel');
// Load initial state from localStorage
const loadStateFromStorage = () => {
  const token = localStorage.getItem('authToken');
  const user = JSON.parse(localStorage.getItem('authUser') || '{}');
  // console.log('Loaded from storage:', { token, user });
  return {
    token: token || null,
    isAuthenticated: !!token,
    user: user || null,
    forgotPassword: {
      email:  null, // Email for forgot password
      otpVerified: false, // OTP verification status
    },
  };
};
const authSlice = createSlice({
    name: 'auth',
    initialState:loadStateFromStorage,
    reducers: {
      loginSuccess: (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        localStorage.setItem('authToken', action.payload.token);
        localStorage.setItem('authUser', JSON.stringify(action.payload.user));
      },
      logout: (state) => {
        state.token = null;
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser')
        channel.postMessage('logout'); // Ensure this runs
        console.log('logout dispatched');
      },
      setForgotPasswordEmail: (state, action) => {
        state.forgotPassword.email = action.payload;
        state.forgotPassword.otpVerified = false; // Reset OTP verification
        localStorage.setItem('forgotPasswordEmail', action.payload); // Persist email
        // console.log('setForgotPasswordEmail dispatched:', {
        //   email: state.forgotPassword.email,
        // });
      },
      setOtpVerified: (state) => {
        state.forgotPassword.otpVerified = true;
        // No need to persist otpVerified in localStorage as it's transient
        // console.log('setOtpVerified dispatched:', {
        //   otpVerified: state.forgotPassword.otpVerified,
        // });
      },
      clearForgotPassword: (state) => {
        state.forgotPassword = { email: null, otpVerified: false };
        localStorage.removeItem('forgotPasswordEmail');
        // console.log('clearForgotPassword dispatched');
      },
    },
  });
  
  export const { loginSuccess, logout,setForgotPasswordEmail, setOtpVerified, clearForgotPassword } = authSlice.actions;
  export default authSlice.reducer;