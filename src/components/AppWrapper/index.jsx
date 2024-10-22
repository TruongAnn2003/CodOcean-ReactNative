// src/components/AppWrapper.js
import React from "react";
import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
import store from "../../services/redux-toolkit/store";

export default function AppWrapper({ children }) {
  return (
    <Provider store={store}>
      {children}
      {/* <PersistGate loading={null} persistor={persistor}>
       
      </PersistGate> */}
    </Provider>
  );
}
