import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';



export const store = configureStore({
    reducer: {
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  });
  
  // Log state changes for debugging
  store.subscribe(() => {
    console.log('Redux state updated:', store.getState());
  });