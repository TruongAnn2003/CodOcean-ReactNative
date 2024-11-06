// src/components/AppLayout.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearMessage } from "../../services/redux-toolkit/reducers/messageSlice";
import AlertDialogComponent from "../AlertDialogComponent";
import { Text } from "react-native";
import { useTranslation } from "react-i18next";

export default function AppLayout({ children }) {
  const { message, showDialog, type } = useSelector((state) => state.message);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const handleCloseDialog = () => {
    dispatch(clearMessage());
  };

  return (
    <>
      {children}
      {showDialog && (
        <AlertDialogComponent
          title={type}
          body={<Text>{message}</Text>}
          isOpenProp={showDialog}
          onCloseProp={handleCloseDialog}
          onConfirm={handleCloseDialog}
        />
      )}
    </>
  );
}
