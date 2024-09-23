import React, { useEffect, useState } from "react";
import { GlobalContext } from "./GlobalContext";
import getAvatarLink from "../dicebear-avt";
const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState({
    fullName: "CodOceaner",
    phoneNumber: "",
    dateOfBirth: "",
    email: "",
    urlImage: getAvatarLink("CodOceaner"),
    addedAt: null,
    updatedAt: null,
    role: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
