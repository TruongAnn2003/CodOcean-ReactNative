import { faClose, faPen, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState, useRef, createRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { requestOTPByEmail } from "../../services/redux-toolkit/reducers/authSlice";
import {
  setError,
  setSuccess,
} from "../../services/redux-toolkit/reducers/messageSlice";
const UserEditModal = ({
  onChangeFullName,
  onChangePhoneNumber,
  onChangeDateOfBirth,
  onChangeEmail,
}) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { profile } = useSelector((state) => state.profile);
  const { error, isLoading } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showVerifyView, setShowVerifyView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef(otp.map(() => createRef()));
  const [editableFields, setEditableFields] = useState({
    fullName: false,
    phone: false,
    dob: false,
    email: false,
  });

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    dob: new Date(),
    email: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    phone: "",
    dob: "",
    email: "",
  });

  useEffect(() => {
    setFormData({
      fullName: profile.fullName,
      phone: profile.phoneNumber,
      dob: profile.dateOfBirth,
      email: profile.email,
    });
  }, [profile]);

  useEffect(() => {
    // Ensure otpRefs is always up to date with the otp state
    otpRefs.current = otp.map(() => createRef());
  }, [otp]);

  const handleSendOTP = async (email) => {
    try {
      const resultAction = await dispatch(requestOTPByEmail(email));
      if (requestOTPByEmail.fulfilled.match(resultAction)) {
        dispatch(setSuccess("OPT đã gửi đến email mới."));
      } else {
        dispatch(
          setError(`${t("features.requestOTPByEmail.failure")} (${error})`)
        );
      }
    } catch (e) {
      dispatch(setError(`${t("features.requestOTPByEmail.failure")} (${e})`));
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value)
          ? ""
          : "Please enter a valid email address";
      case "phone":
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(value.replace(/\s+/g, ""))
          ? ""
          : "Please enter a valid phone number";
      case "fullName":
        return value.trim().length > 0 ? "" : "Full name is required";
      case "dob":
        const date = new Date();
        return !isNaN(date.getTime()) ? "" : "Please enter a valid date";
      default:
        return "";
    }
  };

  const handleEdit = (field) => {
    if (editableFields[field]) {
      const error = validateField(field, formData[field]);
      setErrors((prev) => ({ ...prev, [field]: error }));
      if (!error) {
        setEditableFields((prev) => ({ ...prev, [field]: false }));
      }
    } else {
      setEditableFields((prev) => ({ ...prev, [field]: true }));
    }

    if (editableFields[field]) {
      switch (field) {
        case "email":
          handleSendOTP(formData[field]);
          setShowVerifyView(true);
          return;
        case "phone":
          onChangePhoneNumber(formData[field]);
          return;
        case "fullName":
          onChangeFullName(formData[field]);
          return;
        case "dob":
          onChangeDateOfBirth(formData[field]);
          return;
        default:
          return;
      }
    }
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleOtpChange = (value, index) => {
    if (value.length > 1 || isNaN(value)) return; // Prevent multiple digits or non-numeric input

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      // Check if the next ref exists
      const nextRef = otpRefs.current[index + 1];
      if (nextRef && nextRef.current) {
        setTimeout(() => {
          nextRef.current.focus();
        }, 100);
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = ""; // Remove the previous digit
        setOtp(newOtp);
        otp[index - 1].focus(); // Move focus back
      }
    }
  };

  const handleVerifyOTP = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      return;
    }
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      onChangeEmail(formData["email"], otpValue);
    } catch (e) {
      dispatch(setError("Verify OTP Failed! " + e));
    } finally {
      setShowVerifyView(false);
      setLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className="px-4 py-2 bg-primary text-white rounded-md  transition-colors"
        aria-label="Open edit form"
      >
        <Text>Edit Profile</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="slide"
        visible={isOpen}
        onRequestClose={() => setIsOpen(false)}
      >
        <View
          className="flex-1  bg-opacity-50 items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <View className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <TouchableOpacity
              onPress={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              <FontAwesomeIcon icon={faClose} size={20} color="#000" />
            </TouchableOpacity>

            <Text className="text-2xl font-semibold mb-6">
              Edit Profile Information
            </Text>

            {Object.entries(formData).map(([field, value]) => (
              <View key={field}>
                {field === "dob" ? (
                  <>
                    <View className="mb-4">
                      <Text className="text-sm font-medium text-gray-700 mb-1">
                        {field.charAt(0).toUpperCase() +
                          field.slice(1).replace(/([A-Z])/g, " $1")}
                      </Text>
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
                          {value
                            ? new Date(value).toLocaleDateString()
                            : "Select Date of Birth"}
                        </Text>
                      </Pressable>

                      <TouchableOpacity
                        onPress={() => handleEdit(field)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                        aria-label={`${
                          editableFields[field] ? "Save" : "Edit"
                        } ${field}`}
                      >
                        {editableFields[field] ? (
                          <FontAwesomeIcon
                            icon={faSave}
                            size={20}
                            color="#000"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faPen}
                            size={20}
                            color="#000"
                          />
                        )}
                      </TouchableOpacity>
                      {errors[field] && (
                        <Text className="text-red-600 text-sm mt-1">
                          {errors[field]}
                        </Text>
                      )}
                    </View>
                    {showDatePicker && (
                      <DateTimePicker
                        value={new Date(value) || new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          setShowDatePicker(false);
                          if (selectedDate) {
                            handleChange(field, selectedDate);
                          }
                        }}
                      />
                    )}
                  </>
                ) : (
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-1">
                      {field.charAt(0).toUpperCase() +
                        field.slice(1).replace(/([A-Z])/g, " $1")}
                    </Text>
                    <TextInput
                      value={value}
                      onChangeText={(text) => handleChange(field, text)}
                      editable={editableFields[field]}
                      className={`w-full px-4 py-2 border rounded-md ${
                        errors[field] ? "border-red-500" : "border-gray-300"
                      } ${
                        !editableFields[field] ? "bg-gray-50" : "bg-white"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                      keyboardType={
                        field === "phone"
                          ? "phone-pad"
                          : field === "dob"
                          ? "default"
                          : "default"
                      }
                      placeholder={
                        field.charAt(0).toUpperCase() + field.slice(1)
                      }
                      aria-invalid={errors[field] ? "true" : "false"}
                    />
                    <TouchableOpacity
                      onPress={() => handleEdit(field)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                      aria-label={`${
                        editableFields[field] ? "Save" : "Edit"
                      } ${field}`}
                    >
                      {editableFields[field] ? (
                        <FontAwesomeIcon icon={faSave} size={20} color="#000" />
                      ) : (
                        <FontAwesomeIcon icon={faPen} size={20} color="#000" />
                      )}
                    </TouchableOpacity>
                    {errors[field] && (
                      <Text className="text-red-600 text-sm mt-1">
                        {errors[field]}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            ))}

            {showVerifyView && (
              <>
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700">
                    Verification Code
                  </Text>
                  <View className="flex-row justify-center mt-2">
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={otpRefs.current[index]} // Ref for focus management
                        className={`w-12 h-12 border rounded-md text-center text-lg ${
                          errors.otp ? "border-red-500" : "border-gray-300"
                        }`}
                        maxLength={1}
                        value={digit}
                        onChangeText={(value) => handleOtpChange(value, index)}
                        onKeyPress={(e) => handleKeyDown(e, index)}
                        keyboardType="numeric" // Ensure numeric keyboard
                      />
                    ))}
                  </View>
                  {errors.otp && (
                    <Text className="text-red-600 text-sm mt-1 text-center">
                      {errors.otp}
                    </Text>
                  )}
                </View>
                {isLoading && <Text>...waitting</Text>}

                <TouchableOpacity
                  className="bg-blue-600 rounded-md py-3 mt-4"
                  onPress={handleVerifyOTP}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text className="text-white text-center text-lg font-semibold">
                      Verify OTP
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            <View className="mt-8 flex-row justify-end space-x-4">
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                className="px-4 py-2 bg-pink text-gray-600 hover:text-gray-800"
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default UserEditModal;
