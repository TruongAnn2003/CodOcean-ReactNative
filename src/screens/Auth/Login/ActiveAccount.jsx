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
import { activeAccountRequestOTP, verifyOTP } from "../../../services/api/auth";
import { images as Imgs } from "../../../constants";
import { useGlobalContext } from "../../../services/providers";
import * as _helpers from "../../../utils/_helpers";
import * as _const from "../../../utils/_const";
import { getUserProfile } from "../../../services/api/user";

const ActiveAccount = ({ navigation, route }) => {
  const { token, email } = route.params;
  const [otp, setOtp] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const { loading, setLoading, error, setError, setUser } = useGlobalContext();

  const handlerequestOtp = async () => {
    try {
      setIsButtonDisabled(true);
      setTimer(60);
      _helpers.log("activeAccountRequestOTP-token", token);
      const response = await activeAccountRequestOTP(token, { email });

      if (response.status === 201) {
        Alert.alert("OTP Sent", "The OTP has been sent to your email.");

        const interval = setInterval(() => {
          setTimer((prev) => {
            if (prev === 1) {
              clearInterval(interval);
              setIsButtonDisabled(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        Alert.alert("Error", "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again later.");
      console.error("Error requesting OTP:", error);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      Alert.alert("Warm", "Please enter the OTP code.");
      return;
    }
    try {
      const response = await verifyOTP(token, { otp });
      if (response.status === _const.RESPONSE_STATUS.Created) {
        await _helpers.saveToken(token);
        const profileResponse = await getUserProfile();
        _helpers.log("verifyOtp-response", response);
        if (profileResponse.status === _const.RESPONSE_STATUS.Ok) {
          setUser(profileResponse.data.profile);
          navigation.navigate("Problems");
        } else {
          console.log("Profile data not found.");
          Alert.alert("Error", "Profile data not found.");
        }
      } else {
        Alert.alert(
          "Fail",
          response.data.message || "The OTP code is incorrect."
        );
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again later.");
      console.error("Error verifying OTP:", error);
    }
  };

  // useEffect(() => {
  //   let countdown;
  //   if (timer > 0) {
  //     countdown = setTimeout(() => setTimer(timer - 1), 1000);
  //   } else if (timer === 0) {
  //     setIsButtonDisabled(false);
  //   }
  //   return () => clearTimeout(countdown);
  // }, [timer]);

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
            onPress={handleVerifyOTP}
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
