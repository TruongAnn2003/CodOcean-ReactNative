import React from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { Formik } from "formik";
import {
  commonValidationSchema,
  createValidationSchema,
} from "../../../services/yup/commonValidationSchema";

const FormGetEmail = ({ onContinue }) => {
  const customFields = {
    email: commonValidationSchema.email,
  };
  const validationSchema = createValidationSchema(customFields);
  return (
    <Formik
      initialValues={{ email: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        onContinue(values.email); // Trigger onContinue with the email value
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View className="w-full">
          <Text className="mb-2 text-lg font-sscregular text-secondary">
            Enter Your Email:
          </Text>

          {/* Email Input Field */}
          <TextInput
            placeholder="Email"
            value={values.email}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4 text-base focus:border-secondary focus:outline-none"
            keyboardType="email-address"
          />

          {/* Display Validation Error */}
          {errors.email && touched.email && (
            <Text className="text-red-500 mb-2">{errors.email}</Text>
          )}

          {/* Submit Button */}
          <Button title="Continue" onPress={handleSubmit} />
        </View>
      )}
    </Formik>
  );
};

export default FormGetEmail;
