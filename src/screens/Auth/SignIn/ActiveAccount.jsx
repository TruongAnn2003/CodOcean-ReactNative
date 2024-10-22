import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { images as Imgs } from "../../../constants";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../../../services/redux-toolkit/reducers/errorSlice";
import {
  requestOTPForActivation,
  verifyOTP,
} from "../../../services/redux-toolkit/reducers/authSlice";
import {
  commonValidationSchema,
  createValidationSchema,
} from "../../../services/yup/commonValidationSchema";
import { Formik } from "formik";
const ActiveAccount = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isLocked, setIsLocked] = useState(false);
  const [otpSend, setOtpSend] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const { t } = useTranslation();
  const { isLoading, isFirstLogin } = useSelector((state) => state.auth);
  const customFields = {
    otp: commonValidationSchema.otp,
  };
  const validationSchema = createValidationSchema(customFields);

  useEffect(() => {
    if (isFirstLogin) handleSendOTP();
  }, []);

  useEffect(() => {
    if (otpVerified) {
      navigation.navigate("Problems");
    }
  }, [otpVerified, navigation]);

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
  }, [timer]); // Re-run the effect when timer changes

  const handleSendOTP = async () => {
    try {
      setTimer(60);
      setIsLocked(true);
      const resultAction = await dispatch(requestOTPForActivation());
      if (requestOTPForActivation.fulfilled.match(resultAction)) {
        setOtpSend(true);
      } else {
        await dispatch(setError(t("features.collapsibles.requestOTP.failure")));
        await setIsLocked(false);
      }
    } catch (e) {
      console.error("ActiveAccountForm/handleSendOTP: ", e);
      await dispatch(setError(t("features.collapsibles.requestOTP.failure")));
      await setIsLocked(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const resultAction = await dispatch(verifyOTP(values));
      if (verifyOTP.fulfilled.match(resultAction)) {
        await setOtpVerified(true);
      } else {
        await dispatch(
          setError(t("features.collapsibles.activeAccount.failure"))
        );
      }
    } catch (e) {
      console.error("ActiveAccountForm/handleSubmit: ", e);
      await dispatch(
        setError(t("features.collapsibles.activeAccount.failure"))
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white">
      <View className="flex items-center w-full">
        <Imgs.LogoBgBlue className="mb-4" />
        <View className="w-full p-4 justify-center items-center">
          <Text className="text-2xl mb-6 font-sscsemibold text-secondary">
            Verify OTP
          </Text>

          <Formik
            initialValues={{ otp: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                <TextInput
                  className="w-full h-12 border border-gray-300 font-sscregular rounded-lg px-4 mb-4 focus:border-secondary focus:outline-none"
                  placeholder="Nhập mã OTP"
                  onChangeText={handleChange("otp")}
                  onBlur={handleBlur("otp")}
                  value={values.otp}
                  keyboardType="numeric"
                />
                {errors.otp && touched.otp && (
                  <Text className="text-red-500">{errors.otp}</Text>
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
                  onPress={handleSubmit} // Gọi handleSubmit của Formik
                >
                  <Text className="text-white text-lg font-sscsemibold">
                    Verify OTP
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
                  <Text className="text-secondary text-base font-sscregular">
                    Sign In
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>

          {isLoading && <ActivityIndicator size="large" />}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ActiveAccount;
