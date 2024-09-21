import React, { useEffect, useState } from "react";
import { GlobalContext } from "./GlobalContext";

const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // useEffect(() => {

  // }, []);

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        error,
        setError
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
