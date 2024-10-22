import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import themeSlice from './themeSlice';
import profileSlice from './profileSlice';
import errorSlice from './errorSlice';
import problemSlice from './problemSlice';
const rootReducer = combineReducers({
  auth: authSlice,
  theme: themeSlice,
  profile: profileSlice,
  error: errorSlice,
  problem: problemSlice,
});

export default rootReducer;
