import {configureStore} from '@reduxjs/toolkit';
import todoReducer from '../features/todo/todo';
export const store = configureStore({
    reducer: todoReducer
});