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
  // onChangeEmail,
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
        // case "email":
        //   handleSendOTP(formData[field]);
        //   setShowVerifyView(true);
        //   return;
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

  // const handleOtpChange = (value, index) => {
  //   if (value.length > 1 || isNaN(value)) return; // Prevent multiple digits or non-numeric input

  //   const newOtp = [...otp];
  //   newOtp[index] = value;
  //   setOtp(newOtp);

  //   if (value && index < otp.length - 1) {
  //     // Check if the next ref exists
  //     const nextRef = otpRefs.current[index + 1];
  //     if (nextRef && nextRef.current) {
  //       setTimeout(() => {
  //         nextRef.current.focus();
  //       }, 100);
  //     }
  //   }
  // };

  // const handleKeyDown = (e, index) => {
  //   if (e.key === "Backspace") {
  //     if (!otp[index] && index > 0) {
  //       const newOtp = [...otp];
  //       newOtp[index - 1] = ""; // Remove the previous digit
  //       setOtp(newOtp);
  //       otp[index - 1].focus(); // Move focus back
  //     }
  //   }
  // };

  // const handleVerifyOTP = async () => {
  //   const otpValue = otp.join("");
  //   if (otpValue.length !== 6) {
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 2000));
  //     onChangeEmail(formData["email"], otpValue);
  //   } catch (e) {
  //     dispatch(setError("Verify OTP Failed! " + e));
  //   } finally {
  //     setShowVerifyView(false);
  //     setLoading(false);
  //   }
  // };

  const handleSaveAll = () => {
    // Validate all fields
    let hasErrors = false;
    Object.entries(formData).forEach(([field, value]) => {
      const error = validateField(field, value);
      if (error) {
        setErrors(prev => ({ ...prev, [field]: error }));
        hasErrors = true;
      }
    });

    if (!hasErrors) {
      // Save all changes
      onChangeFullName(formData.fullName);
      onChangePhoneNumber(formData.phone);
      onChangeDateOfBirth(formData.dob);
      setIsOpen(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-500 rounded-lg flex-row items-center justify-center space-x-2"
        aria-label="Open edit form"
      >
        <FontAwesomeIcon icon={faPen} size={16} color="#fff" />
        <Text className="text-white font-medium">Edit Profile</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="slide"
        visible={isOpen}
        onRequestClose={() => setIsOpen(false)}
      >
        <View
          className="flex-1 items-center justify-center px-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <View className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-gray-800">
                Edit Profile
              </Text>
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                className="p-2 rounded-full bg-red-100 hover:bg-red-200"
                aria-label="Close modal"
              >
                <FontAwesomeIcon icon={faClose} size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>

            {Object.entries(formData).map(([field, value]) => (
              <View key={field} className="mb-6">
                {field === "dob" ? (
                  <>
                    <View className="relative">
                      <Text className="text-sm font-semibold text-gray-700 mb-2">
                        {field === "dob" ? "Date of Birth" : field.charAt(0).toUpperCase() + field.slice(1)}
                      </Text>
                      <Pressable
                        className="flex-row items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white"
                        onPress={() => setShowDatePicker(true)}
                      >
                        <Text className="text-gray-700">
                          {value ? new Date(value).toLocaleDateString() : "Select Date of Birth"}
                        </Text>
                        <FontAwesomeIcon icon={faPen} size={16} color="#6B7280" />
                      </Pressable>
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
                  <View className="relative">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                      {field === "fullName" ? "Full Name" : 
                       field === "phoneNumber" ? "Phone Number" :
                       field.charAt(0).toUpperCase() + field.slice(1)}
                    </Text>
                    <View className="relative">
                      <TextInput
                        value={value}
                        onChangeText={(text) => handleChange(field, text)}
                        editable={editableFields[field]}
                        className={`w-full px-4 py-3 border rounded-lg ${
                          errors[field] ? "border-red-500" : "border-gray-300"
                        } ${
                          !editableFields[field] ? "bg-gray-50" : "bg-white"
                        }`}
                        keyboardType={field === "phone" ? "phone-pad" : "default"}
                        placeholder={`Enter your ${field === "fullName" ? "full name" : field}`}
                      />
                      {field !== "email" && (
                        <TouchableOpacity
                          onPress={() => handleEdit(field)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          <FontAwesomeIcon
                            icon={editableFields[field] ? faSave : faPen}
                            size={18}
                            color={editableFields[field] ? "#2563EB" : "#6B7280"}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                    {errors[field] && (
                      <Text className="text-red-500 text-sm mt-1">
                        {errors[field]}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            ))}

            <View className="flex-row justify-end space-x-3 mt-6">
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                className="px-6 py-3 bg-red-500 rounded-lg"
              >
                <Text className="text-white font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveAll}
                className="px-6 py-3 bg-blue-500 rounded-lg"
              >
                <Text className="text-white font-medium">Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default UserEditModal;
