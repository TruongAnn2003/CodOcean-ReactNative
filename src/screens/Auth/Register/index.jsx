import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Pressable,
} from "react-native";

const Register = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    const handleSignup = async () => {
      if (!username || !email || !password) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8000/api/login/sign-up",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: username,
              email: email,
              password: password,
            }),
          }
        );

        const data = await response.json();
        if (response.ok) {
          Alert.alert("Success", "Account created successfully");
          navigation.navigate("Login");
        } else {
          Alert.alert("Signup failed", data.message || "An error occurred");
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred. Please try again later.");
        console.error("Signup error:", error);
      }
    };
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên người dùng"
        onChangeText={(text) => setName(text)}
        value={name}
      />
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
      <Button title="Đăng ký" onPress={handleRegister} />
      <View style={styles.loginRedirect}>
        <Text>Đã có tài khoản? </Text>
        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginLink}>Đăng nhập</Text>
        </Pressable>
      </View>
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
  loginRedirect: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginLink: {
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default Register;
