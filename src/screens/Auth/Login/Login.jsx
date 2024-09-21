import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../../../services/api/auth";
import { useGlobalContext } from "../../../services/providers";

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
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <Button
        onPress={handleLogin}
        title={loading ? "Logging in..." : "Login"}
        disabled={loading}
      />
      <View style={styles.spacing} />
      <Button title="Đăng ký" onPress={navigateRegister} />
      <View style={styles.spacing} />
      <Button title="Quên mật khẩu" onPress={navigateForgotPassword} />
      {loading && <ActivityIndicator size="large" />}
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

export default Login;
