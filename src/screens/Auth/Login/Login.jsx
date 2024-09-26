import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { login } from "../../../services/api/auth";
import * as _helpers from "../../../utils/_helpers";
import * as _const from "../../../utils/_const";
import { getUserProfile } from "../../../services/api/user";
import { useGlobalContext } from "../../../services/providers";
import { images as Imgs } from "../../../constants";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, setLoading, error, setError, setUser } = useGlobalContext();

  useEffect(() => {
    // Set the title of the screen if needed
    navigation.setOptions({ title: "Login" });
  }, [navigation]);

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

    if (!_helpers.validateEmail(email)) {
      Alert.alert("Error", "Invalid email format");
      setLoading(false);
      return;
    }
    if (!_helpers.validatePassword(password)) {
      Alert.alert("Error", "Invalid password format");
      setLoading(false);
      return;
    }

    try {
      const response = await login({ email, password });
      const data = response.data;
      const token = data.token;
      const isActive = data.isActive;

      if (!isActive) {
        navigation.navigate("ActiveAccount", { token, email });
      } else {
        _helpers.saveToken(token);
        const profileResponse = await getUserProfile();

        if (profileResponse.status === _const.RESPONSE_STATUS.Ok) {
          setUser(profileResponse.data.profile);
          navigation.navigate("Problems");
        } else {
          console.log("Profile data not found.");
          Alert.alert("Error", "Profile data not found.");
        }
      }
    } catch (e) {
      console.error("Login failed:", e);
      setError(e.message || "An error occurred");
      Alert.alert("Login Failed", e.message || "An error occurred");
    } finally {
      setLoading(false);
      // Clear password after login attempt
      setPassword("");
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white">
      <View className="flex items-center w-full">
        <Imgs.LogoBgBlue className="mb-4" />
        <View className="w-full p-4 justify-center items-center ">
          <Text className="text-2xl mb-6 font-sscsemibold text-primary">
            Login
          </Text>
          <TextInput
            className="w-full h-12 font-sscregular border border-gray-300 rounded-lg px-4 mb-4 focus:border-secondary focus:outline-none"
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            className="w-full h-12 border font-sscregular border-gray-300 rounded-lg px-4 mb-4 focus:border-secondary focus:outline-none"
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={setPassword}
            value={password}
          />
          <TouchableOpacity
            className="w-full h-12 bg-primary justify-center items-center rounded-lg mb-4"
            disabled={loading}
            onPress={handleLogin}
          >
            <Text className="text-white text-lg font-sscsemibold">
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mb-4">
            <TouchableOpacity onPress={navigateRegister} className="mr-4">
              <Text className="text-secondary-100 text-base font-sscregular">
                Create Account
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateForgotPassword}>
              <Text className="text-secondary-100 text-base font-sscregular">
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
