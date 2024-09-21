import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ActiveAccount = ({ navigation, route }) => {
  const { token } = route.params;
  const [otp, setOtp] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(0);

  const requestOtp = async () => {
    try {
      setIsButtonDisabled(true);
      setTimer(60);

      const response = await fetch(
        "http://localhost:8000/api/login/request-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Thành công", "Mã OTP đã được gửi đến email của bạn.");
      } else {
        Alert.alert("Thất bại", data.message || "Không thể gửi mã OTP.");
      }
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
      const response = await fetch(
        "http://localhost:8000/api/login/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem("jwtToken", token);

        navigation.navigate("Home");
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
        onPress={requestOtp}
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
