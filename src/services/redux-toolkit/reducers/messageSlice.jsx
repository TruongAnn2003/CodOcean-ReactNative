import { createSlice } from "@reduxjs/toolkit";
import { MESSAGE_TYPE } from "../../../constants";

const initialState = {
  message: "",
  showDialog: false,
  type: MESSAGE_TYPE.INFO,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setInfo: (state, action) => {
      state.message = action.payload;
      state.type = MESSAGE_TYPE.INFO;
      state.showDialog = true;
    },
    setError: (state, action) => {
      state.message = action.payload;
      state.type = MESSAGE_TYPE.ERROR;
      state.showDialog = true;
    },
    setWarning: (state, action) => {
      state.message = action.payload;
      state.type = MESSAGE_TYPE.WARNING;
      state.showDialog = true;
    },
    setSuccess: (state, action) => {
      state.message = action.payload;
      state.type = MESSAGE_TYPE.SUCCESS;
      state.showDialog = true;
    },
    setDebug: (state, action) => {
      state.message = action.payload;
      state.type = MESSAGE_TYPE.DEBUG;
      state.showDialog = true;
    },
    setLoading: (state, action) => {
      state.message = action.payload;
      state.type = MESSAGE_TYPE.LOADING;
      state.showDialog = true;
    },
    clearMessage: (state) => {
      state.message = "";
      state.showDialog = false;
      state.type = MESSAGE_TYPE.INFO;
    },
  },
});

export const {
  setInfo,
  setError,
  setWarning,
  setSuccess,
  setLoading,
  setDebug,
  clearMessage,
} = messageSlice.actions;

export default messageSlice.reducer;
