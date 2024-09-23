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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { requestOtp, verifyOtp, saveToken } from "../../../services/api/auth";
import { images as Imgs } from "../../../constants";
import { useGlobalContext } from "../../../services/providers";
const ActiveAccount = ({ navigation, route }) => {
  const { token } = route.params;
  const [otp, setOtp] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const { loading, setLoading, error, setError } = useGlobalContext();
  const handlerequestOtp = async () => {
    try {
      setIsButtonDisabled(true);
      setTimer(60);
      const otpData = await requestOtp(token);
      console.log(otpData);
    } catch (error) {
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi gửi mã OTP. Vui lòng thử lại sau.");
      console.error("Error requesting OTP:", error);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert("Lỗi", "Vui lòng nhập mã OTP");
      return;
    }
    try {
      const data = await verifyOtp(token, otp);
      if (data.successfully) {
        saveToken(token);
        navigation.navigate("Login");
      } else {
        Alert.alert("Thất bại", data.message || "Mã OTP không chính xác");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Đã xảy ra lỗi. Vui lòng thử lại sau.");
      console.error("Error verifying OTP:", error);
    }
  };

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setTimeout(() => setTimer(timer - 1), 1000);
    } else if (timer === 0) {
      setIsButtonDisabled(false);
    }
    return () => clearTimeout(countdown);
  }, [timer]);

  return (
    <SafeAreaView className={"flex-1 justify-center items-center bg-white"}>
      <View className="flex items-center w-full">
        <Imgs.LogoBgBlue className="mb-4" />
        <View className="w-full p-4 justify-center  items-center">
          <Text classname="text-2xl mb-6 font-sscsemibold text-primary">
            Verify OTP
          </Text>
          <TextInput
            className={
              "w-full h-12 border border-gray-300 font-sscregular rounded-lg px-4 mb-4 focus:border-secondary focus:outline-none"
            }
            placeholder="Nhập mã OTP"
            onChangeText={setOtp}
            value={otp}
          />
          <TouchableOpacity
            className={
              "w-full h-12 bg-primary justify-center items-center rounded-lg mb-4 "
            }
            disabled={isButtonDisabled}
            onPress={handlerequestOtp}
          >
            <Text className={"text-white text-lg font-sscsemibold"}>
              {isButtonDisabled ? `Send OTP (${timer}s)` : "Send OTP"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={
              "w-full h-12 bg-secondary-100 justify-center items-center rounded-lg mb-4"
            }
            disabled={isButtonDisabled}
            onPress={handleVerifyOtp}
          >
            <Text className={"text-white text-lg font-sscsemibold"}>
              Verify OTP
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text className="text-secondary-100 text-base font-sscregular">
              Login
            </Text>
          </TouchableOpacity>
          {loading && <ActivityIndicator size="large" />}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ActiveAccount;
