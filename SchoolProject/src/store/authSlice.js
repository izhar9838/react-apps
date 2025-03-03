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
        
        // console.log('loginSuccess dispatched:', {
        //   token: state.token,
        //   isAuthenticated: state.isAuthenticated,
        //   user: state.user,
        // });
        
        
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
    },
  });
  
  export const { loginSuccess, logout } = authSlice.actions;
  export default authSlice.reducer;