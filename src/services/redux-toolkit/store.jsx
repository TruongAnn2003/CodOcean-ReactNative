import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import logger from "redux-logger";
import { tokenMiddleware } from "./middlewares";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
// const persistConfig = {
//   key: "root",
//   storage: AsyncStorage,

//   whitelist: [],
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        // Ignore these paths in the state
        ignoredPaths: ["auth.register", "auth.rehydrate"], // Replace with the actual paths if needed
      },
    }).concat(tokenMiddleware, logger),
});

// const persistor = persistStore(store);
export default store;
