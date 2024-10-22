import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Formik } from "formik";
import {
  commonValidationSchema,
  createValidationSchema,
} from "../../../services/yup/commonValidationSchema";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../../../services/redux-toolkit/reducers/errorSlice";
import {
  forgotPassword,
  requestOTPByEmail,
} from "../../../services/redux-toolkit/reducers/authSlice";
import { useTranslation } from "react-i18next";
const FormResetPasswordVerifyOTP = ({ email }) => {
  const customFields = {
    email: commonValidationSchema.email,
    otp: commonValidationSchema.otp,
    newPassword: commonValidationSchema.newPassword,
    confirmedNewPassword: commonValidationSchema.confirmedNewPassword,
  };
  const validationSchema = createValidationSchema(customFields);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isLocked, setIsLocked] = useState(false);
  const [otpSend, setOtpSend] = useState(false);
  const [timer, setTimer] = useState(0);
  const { isLoading, error } = useSelector((state) => state.auth);
  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setTimeout(() => {
        setTimer((prevTimer) => prevTimer - 1); // Use functional update to get the latest timer value
      }, 1000);
    } else if (timer === 0) {
      setIsLocked(false); // Lock the button when timer reaches 0
    }

    return () => clearTimeout(countdown); // Clear timeout on cleanup
  }, [timer]);

  const handleSendOTP = async () => {
    try {
      setIsLocked(true); // Lock the button when OTP is being sent
      setTimer(60); // Set timer to 60 seconds
      const resultAction = await dispatch(requestOTPByEmail(email));
      if (requestOTPByEmail.fulfilled.match(resultAction)) {
        setOtpSend(true); // OTP sent successfully
      } else {
        dispatch(
          setError(
            `${t("features.collapsibles.resetPassword.failure")} (${error})`
          )
        );
        setIsLocked(false); // Unlock the button on failure
      }
    } catch (e) {
      console.error("ResetPasswordWithOTPForm/handleSendOTP: ", e);
      dispatch(
        setError(
          `${t("features.collapsibles.resetPassword.failure")} (${e.message})`
        )
      );
      setIsLocked(false); // Unlock the button if there's an error
    }
  };
  const handleResetPassword = async (values) => {
    const { confirmedNewPassword, ...submitValues } = values;

    try {
      const resultAction = await dispatch(forgotPassword(submitValues));
      console.log(values);
      if (forgotPassword.fulfilled.match(resultAction)) {
        navigation.navigate("SignIn");
      } else {
        dispatch(
          setError(
            `${t("features.collapsibles.resetPassword.failure")} (${error})`
          )
        );
      }
    } catch (e) {
      console.error("ResetPasswordWithOTPForm/handleSubmit: ", e);
      dispatch(
        setError(
          `${t("features.collapsibles.resetPassword.failure")} (${e.message})`
        )
      );
    }
  };
  return (
    <Formik
      initialValues={{
        email: email,
        otp: "",
        newPassword: "",
        confirmedNewPassword: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleResetPassword}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View className="w-full p-4">
          <Text className="mb-2 text-lg font-sscregular text-secondary">
            Email:
          </Text>
          <TextInput
            className="w-full h-12 font-sscregular border border-gray-300 rounded-lg px-4 mb-4 focus:border-secondary focus:outline-none"
            placeholder="Email"
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            value={values.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && touched.email && (
            <Text className="text-red-500">{errors.email}</Text>
          )}
          {/* New Password Field */}
          <Text className="mb-2 text-lg font-sscregular text-secondary">
            New Password:
          </Text>
          <TextInput
            placeholder="New Password"
            value={values.newPassword}
            onChangeText={handleChange("newPassword")}
            onBlur={handleBlur("newPassword")}
            className="w-full h-12 font-sscregular border border-gray-300 rounded-lg px-4 mb-4 text-base focus:border-secondary focus:outline-none"
            secureTextEntry={true} // Hide password input
          />
          {errors.newPassword && touched.newPassword && (
            <Text className="text-red-500 mb-2">{errors.newPassword}</Text>
          )}
          <Text className="mb-2 text-lg font-sscregular text-secondary">
            New Password:
          </Text>
          <TextInput
            placeholder="Confirmed New Password"
            value={values.confirmedNewPassword}
            onChangeText={handleChange("confirmedNewPassword")}
            onBlur={handleBlur("confirmedNewPassword")}
            className="w-full h-12 font-sscregular border border-gray-300 rounded-lg px-4 mb-4 text-base focus:border-secondary focus:outline-none"
            secureTextEntry={true} // Hide password input
          />
          {errors.confirmedNewPassword && touched.confirmedNewPassword && (
            <Text className="text-red-500 mb-2">
              {errors.confirmedNewPassword}
            </Text>
          )}
          {/* OTP Field */}
          <Text className="mb-2 text-lg font-sscregular text-secondary">
            OTP:
          </Text>
          <TextInput
            placeholder="Enter OTP"
            value={values.otp}
            onChangeText={handleChange("otp")}
            onBlur={handleBlur("otp")}
            className="w-full h-12 font-sscregular border border-gray-300 rounded-lg px-4 mb-4 text-base focus:border-secondary focus:outline-none"
          />
          {errors.otp && touched.otp && (
            <Text className="text-red-500 mb-2">{errors.otp}</Text>
          )}
          <TouchableOpacity
            className="w-full h-12 bg-primary justify-center items-center rounded-lg mb-4"
            disabled={isLocked || isLoading}
            onPress={handleSendOTP}
          >
            <Text className="text-white text-lg font-sscsemibold">
              {isLocked ? `Send OTP (${timer}s)` : "Send OTP"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-full h-12 bg-secondary justify-center items-center rounded-lg mb-4"
            onPress={handleSubmit} // Formik's submit handler
          >
            <Text className="text-white text-lg font-sscsemibold">
              Reset Password
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

export default FormResetPasswordVerifyOTP;
