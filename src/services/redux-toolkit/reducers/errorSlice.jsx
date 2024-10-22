import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  errorMessage: '',
  showErrorDialog: false,
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError: (state, action) => {
      state.errorMessage = action.payload;
      state.showErrorDialog = true;
    },
    clearError: (state) => {
      state.errorMessage = '';
      state.showErrorDialog = false;
    },
  },
});

export const { setError, clearError } = errorSlice.actions;

export default errorSlice.reducer;
