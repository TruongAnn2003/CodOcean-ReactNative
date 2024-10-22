// src/components/AppLayout.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearError } from "../../services/redux-toolkit/reducers/errorSlice";
import AlertDialogComponent from "../AlertDialogComponent";
import { Text } from "react-native";

export default function AppLayout({ children }) {
  const { errorMessage, showErrorDialog } = useSelector((state) => state.error);
  const dispatch = useDispatch();

  // Handle close error dialog
  const handleCloseErrorDialog = () => {
    dispatch(clearError());
  };

  return (
    <>
      {children}
      {showErrorDialog && (
        <AlertDialogComponent
          title="Error"
          body={<Text>{errorMessage}</Text>}
          isOpenProp={showErrorDialog}
          onCloseProp={handleCloseErrorDialog}
          onConfirm={handleCloseErrorDialog}
        />
      )}
    </>
  );
}
