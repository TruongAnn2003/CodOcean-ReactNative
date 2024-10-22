import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  Alert,
  ScrollView,
  Pressable,
  TouchableOpacity,
  ActivityIndicator, // Đừng quên import ActivityIndicator nếu bạn dùng nó
} from "react-native";
import getAvatarLink from "../../../services/dicebear-avt";
import DateTimePicker from "@react-native-community/datetimepicker"; // Import DateTimePicker
import { images as Imgs } from "../../../constants";
import { Formik } from "formik";
import { setError } from "../../../services/redux-toolkit/reducers/errorSlice";
import { signUp } from "../../../services/redux-toolkit/reducers/authSlice";
import {
  commonValidationSchema,
  createValidationSchema,
} from "../../../services/yup/commonValidationSchema";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { formatDateToISO } from "../../../utils/dateUtils";
const SignUp = ({ navigation }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const customFields = {
    fullName: commonValidationSchema.fullName,
    email: commonValidationSchema.email,
    password: commonValidationSchema.password,
    dateOfBirth: commonValidationSchema.dateOfBirth,
    phoneNumber: commonValidationSchema.phoneNumber,
    confirmedPassword: commonValidationSchema.confirmedPassword,
  };
  const validationSchema = createValidationSchema(customFields);
  const [showDatePicker, setShowDatePicker] = useState(false); // State để quản lý hiển thị DatePicker
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSignUp = async (values) => {
    const { confirmedPassword, ...submitValues } = values;
    const formattedDateOfBirth = formatDateToISO(values.dateOfBirth);
    const updatedSubmitValues = {
      ...submitValues,
      dateOfBirth: formattedDateOfBirth, // Thêm ngày sinh đã được định dạng vào submitValues
    };
    console.info("handleSignUp", values);
    try {
      const resultAction = await dispatch(signUp(updatedSubmitValues));
      if (signUp.fulfilled.match(resultAction)) {
          navigation.navigate("SignIn");
      } else {
        dispatch(setError(t("features.collapsibles.signUp.failure")));
      }
    } catch (e) {
      console.error("SignUpForm/handleSubmit: ", e);
      dispatch(setError(t("features.collapsibles.signUp.failure")));
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
        }}
      >
        <View className="flex items-center w-full">
          <Imgs.LogoBgBlue className="mb-4" />
          <View className="w-full p-4 justify-center items-center ">
            <Text className="text-2xl mb-6 font-sscsemibold text-secondary">
              Sign Up
            </Text>

            <Formik
              initialValues={{
                fullName: "",
                email: "",
                phoneNumber: "",
                password: "",
                confirmedPassword: "",
                dateOfBirth: new Date(),
              }}
              validationSchema={validationSchema}
              onSubmit={handleSignUp} // Xử lý đăng ký ở đây
            >
              {({
                handleChange,
                handleBlur,
                setFieldValue,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <>
                  <TextInput
                    className="w-full h-12 border font-sscregular border-gray-300 rounded-lg px-4 mb-4 focus:border-secondary focus:outline-none"
                    placeholder="Full Name"
                    onChangeText={handleChange("fullName")}
                    onBlur={handleBlur("fullName")}
                    value={values.fullName}
                  />
                  {errors.fullName && touched.fullName && (
                    <Text className="text-red-500">{errors.fullName}</Text>
                  )}

                  <TextInput
                    className="w-full h-12 border font-sscregular border-gray-300 rounded-lg px-4 mb-4 focus:border-secondary focus:outline-none"
                    placeholder="Email"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                  />
                  {errors.email && touched.email && (
                    <Text className="text-red-500">{errors.email}</Text>
                  )}

                  <TextInput
                    className="w-full h-12 border font-sscregular border-gray-300 rounded-lg px-4 mb-4 focus:border-secondary focus:outline-none"
                    placeholder="Phone Number"
                    onChangeText={handleChange("phoneNumber")}
                    onBlur={handleBlur("phoneNumber")}
                    value={values.phoneNumber}
                  />
                  {errors.phoneNumber && touched.phoneNumber && (
                    <Text className="text-red-500">{errors.phoneNumber}</Text>
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
                  <TextInput
                    className="w-full h-12 border font-sscregular border-gray-300 rounded-lg px-4 mb-4 focus:border-secondary focus:outline-none"
                    placeholder="Confirmed Password"
                    secureTextEntry={true}
                    onChangeText={handleChange("confirmedPassword")}
                    onBlur={handleBlur("confirmedPassword")}
                    value={values.confirmedPassword}
                  />
                  {errors.confirmedPassword && touched.confirmedPassword && (
                    <Text className="text-red-500">
                      {errors.confirmedPassword}
                    </Text>
                  )}
                  <Pressable
                    style={{
                      width: "100%",
                      height: 48,
                      borderWidth: 1,
                      borderColor: "#D1D5DB",
                      borderRadius: 8,
                      justifyContent: "center",
                      paddingLeft: 16,
                      marginBottom: 16,
                    }}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text className="text-base font-regular text-[#D1D5DB]">
                      {values.dateOfBirth
                        ? values.dateOfBirth.toLocaleDateString()
                        : "Select Date of Birth"}
                    </Text>
                   
                  </Pressable>

                  {showDatePicker && (
                    <DateTimePicker
                      value={values.dateOfBirth || new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          setFieldValue("dateOfBirth", selectedDate); // Correct way to update Formik's value
                        }
                      }}
                    />
                  )}

                  {/* Submit Button */}
                  <TouchableOpacity
                    style={{
                      width: "100%",
                      height: 48,
                      backgroundColor: "#048cbf",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 8,
                      marginBottom: 16,
                    }}
                    disabled={isLoading}
                    onPress={() => {
                      console.info("handleSubmit", values);
                      console.info("handleSubmit", errors);
                      handleSubmit();
                    }}
                  >
                    <Text className="text-white text-base font-sscregular">
                      {isLoading ? "Registering..." : "Submit"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => navigation.navigate("SignIn")}
                  >
                    <Text className="text-secondary text-base font-sscregular">
                      Login
                    </Text>
                  </TouchableOpacity>

                  {isLoading && <ActivityIndicator size="large" />}
                </>
              )}
            </Formik>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
