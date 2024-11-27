import { Formik } from "formik";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { LogoBgBlue } from "../../../constants/images";
import {
  getCurrentUser,
  signIn,
  setUser,
} from "../../../services/redux-toolkit/reducers/authSlice";
import { setError } from "../../../services/redux-toolkit/reducers/messageSlice";
import {
  commonValidationSchema,
  createValidationSchema,
} from "../../../services/yup/commonValidationSchema";
import { getProfile } from "../../../services/redux-toolkit/reducers/profileSlice";
import { saveTokens } from "../../../utils/tokenUtils";
const SignIn = ({ navigation }) => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  const { t } = useTranslation();

  const customFields = {
    email: commonValidationSchema.email,
  };
  const validationSchema = createValidationSchema(customFields);

  useEffect(() => {
    // Set the title of the screen if needed
    navigation.setOptions({ title: "Login" });
  }, [navigation]);

  const handleGetProfileCurrentUser = async () => {
    try {
      const resultAction = await dispatch(getProfile());
      if (getProfile.fulfilled.match(resultAction)) {
        await dispatch(setUser({ user: resultAction.payload.profile }));
      } else {
        await dispatch(setError("Failed to get profile"));
      }
    } catch (e) {
      await dispatch(setError(`${t("Failed to get profile")} (${e})`));
    }
  };

  const navigateSignUp = () => {
    navigation.navigate("SignUp");
  };

  const navigateForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  const handleLogin = async (values) => {
    try {
      const resultAction = await dispatch(signIn(values));

      if (resultAction?.payload) {
        const activeStatus = resultAction.payload.isActive;

        if (signIn.fulfilled.match(resultAction)) {
          await saveTokens(
            resultAction.payload.accessToken,
            resultAction.payload.refreshToken
          );
          if (!activeStatus) {
            await navigation.navigate("ActiveAccount");
          } else {
            await handleGetProfileCurrentUser();
            await navigation.navigate("Problems");
          }
        } else {
          await dispatch(
            setError(
              `${t("features.auth.signIn.invalidCredentials")} (${error})`
            )
          );
        }
      } else {
        await dispatch(
          setError(`${t("features.auth.signIn.failure")} (${error})`)
        );
      }
    } catch (e) {
      await dispatch(
        setError(`${t("features.auth.signIn.failure")} (${e.message})`)
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white">
      <View className="flex items-center w-full">
        <LogoBgBlue className="mb-4" />
        <View className="w-full p-4 justify-center items-center">
          <Text className="text-2xl mb-6 font-sscsemibold text-secondary">
            Sign In
          </Text>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
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

                <TextInput
                  className="w-full h-12 border font-sscregular border-gray-300 rounded-lg px-4 mb-4 focus:border-secondary focus:outline-none"
                  placeholder="Password"
                  secureTextEntry={true}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                />
                {errors.password && touched.password && (
                  <Text className="text-red-500">{errors.password}</Text>
                )}

                <TouchableOpacity
                  className="w-full h-12 bg-primary justify-center items-center rounded-lg mb-4"
                  disabled={isLoading}
                  onPress={handleSubmit} // Gọi handleSubmit của Formik
                >
                  <Text className="text-white text-lg font-sscsemibold">
                    {isLoading ? "Logging in..." : "Login"}
                  </Text>
                </TouchableOpacity>

                <View className="flex-row justify-center mb-4">
                  <TouchableOpacity onPress={navigateSignUp} className="mr-4">
                    <Text className="text-secondary text-base font-sscregular">
                      Create Account
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={navigateForgotPassword}>
                    <Text className="text-secondary text-base font-sscregular">
                      Forgot Password
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>

          {isLoading && <ActivityIndicator size="large" />}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
