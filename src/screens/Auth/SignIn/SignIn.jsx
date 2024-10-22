import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { images as Imgs } from "../../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import { setError } from "../../../services/redux-toolkit/reducers/errorSlice";
import {
  signIn,
  getCurrentUser,
} from "../../../services/redux-toolkit/reducers/authSlice";
import {
  commonValidationSchema,
  createValidationSchema,
} from "../../../services/yup/commonValidationSchema";
import { useTranslation } from "react-i18next";

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
         if (!activeStatus) {
           await dispatch(getCurrentUser());
           await navigation.navigate("ActiveAccount");
         } else {
           await dispatch(getCurrentUser());
           await navigation.navigate("Problems");
         }
       } else {
         // Log the error and display user-friendly error message
         const errorMessage = `${t(
           "features.collapsibles.signIn.invalidCredentials"
         )} (${error})`;
         await dispatch(setError(errorMessage));
       }
     } else {
       await dispatch(setError(t("features.collapsibles.signIn.failure")));
     }
   } catch (e) {
     // Provide a more detailed error handling
     await dispatch(
       setError(`${t("features.collapsibles.signIn.failure")} (${e.message})`)
     );
   }
 };

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white">
      <View className="flex items-center w-full">
        <Imgs.LogoBgBlue className="mb-4" />
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
