import React, { createContext, useContext } from "react";
const GlobalContext = createContext(null);
const useGlobalContext = () => useContext(GlobalContext);
export { GlobalContext, useGlobalContext };
