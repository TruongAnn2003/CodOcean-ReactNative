import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../../../services/api/auth";
import { useGlobalContext } from "../../../services/providers";
import { validateEmail, validatePassword } from "../../../utils/helpers";
import { images as Imgs } from "../../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, setLoading, error, setError, setUser } = useGlobalContext();
  const navigateRegister = () => {
    navigation.navigate("Register");
  };

  const navigateForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      setLoading(false);
      return;
    }

    if (!validateEmail(email) || !validatePassword(password)) {
      Alert.alert("Error", "Invalid email or password format");
      setLoading(false);
      return;
    }

    try {
      const data = await login({ email, password });
      console.log("Login successful:", data);

      const token = data.token;
      const isActive = data.isActive;
      console.log(token);
      console.log(isActive);
      if (isActive === false) {
        navigation.navigate("ActiveAccount", { token });
      } else {
        await AsyncStorage.setItem("jwtToken", token);
        if (data.message === "user.login.login_successfully") {
          navigation.navigate("Problems");
        } else {
          Alert.alert(
            "Đăng nhâp thất bại",
            data.message || "An error occurred"
          );
        }
      }
    } catch (e) {
      console.error("Login failed:", e);
      setError(e.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className={"flex-1 justify-center items-center bg-white"}>
      <View className="flex items-center w-full">
        <Imgs.LogoBgBlue className="mb-4" />
        <View className="w-full p-4 justify-center items-center">
          <Text
            style={[
              tw`text-2xl mb-6`,
              { color: "#030BA6", fontFamily: "SSC-Bold" },
            ]}
          >
            Login
          </Text>
          <TextInput
            className={
              "w-full h-12 border border-gray-300 rounded-lg px-4 mb-4 focus:border-secondary focus:outline-none"
            }
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            style={{ fontFamily: "SSC-Regular" }}
          />
          <TextInput
            className={
              "w-full h-12 border border-gray-300 rounded-lg px-4 mb-4 focus:border-secondary focus:outline-none"
            }
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={setPassword}
            value={password}
            style={{ fontFamily: "SSC-Regular" }}
          />
          <TouchableOpacity
            className={
              "w-full h-12 bg-primary justify-center items-center rounded-lg mb-4"
            }
            disabled={loading}
            onPress={handleLogin}
          >
            <Text
              className={"text-white text-lg"}
              style={{ fontFamily: "SSC-Bold" }}
            >
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mb-4">
            <TouchableOpacity onPress={navigateRegister} className="mr-4">
              <Text
                className={"text-blue-600 text-base"}
                style={{ fontFamily: "SSC-Regular" }}
              >
                Create Account
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateForgotPassword}>
              <Text
                className={"text-blue-600 text-base"}
                style={{ fontFamily: "SSC-Regular" }}
              >
                Forgot Password
              </Text>
            </TouchableOpacity>
          </View>
          {loading && <ActivityIndicator size="large" />}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
