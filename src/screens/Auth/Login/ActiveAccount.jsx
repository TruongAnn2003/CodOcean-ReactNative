import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { requestOtp, verifyOtp } from "../../../services/api/auth";
const ActiveAccount = ({ navigation, route }) => {
  const { token } = route.params;
  const [otp, setOtp] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(0);

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
        await AsyncStorage.setItem("jwtToken", token);
        navigation.navigate("Problems");
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
    <View style={styles.container}>
      <Text style={styles.title}>Xác minh OTP</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập mã OTP"
        onChangeText={(text) => setOtp(text)}
        value={otp}
      />
      <Button
        title={isButtonDisabled ? `Nhận mã OTP (${timer}s)` : "Nhận mã OTP"}
        onPress={handlerequestOtp}
        disabled={isButtonDisabled}
      />
      <View style={styles.spacing} />
      <Button title="Xác minh OTP" onPress={handleVerifyOtp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  spacing: {
    marginVertical: 10,
  },
});

export default ActiveAccount;
