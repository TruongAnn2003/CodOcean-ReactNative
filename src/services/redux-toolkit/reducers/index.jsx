import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import themeSlice from "./themeSlice";
import profileSlice from "./profileSlice";
import messageSlice from "./messageSlice";
import problemSlice from "./problemSlice";
import discussionSlice from "./discussionSlice";
const rootReducer = combineReducers({
  auth: authSlice,
  theme: themeSlice,
  profile: profileSlice,
  message: messageSlice,
  problem: problemSlice,
  discussion: discussionSlice,
});

export default rootReducer;
