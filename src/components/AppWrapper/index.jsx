import React from "react";
import { Provider } from "react-redux";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import store from "../../services/redux-toolkit/store";

export default function AppWrapper({ children }) {
  return (
    <Provider store={store}>
      <ApplicationProvider {...eva} theme={eva.light}>
        {children}
      </ApplicationProvider>
    </Provider>
  );
}
