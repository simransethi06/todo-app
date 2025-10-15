import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => navigation.replace("Home"))
      .catch(err => Alert.alert("Login Error", err.message));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>
      <Text onPress={() => navigation.navigate("Signup")} style={styles.link}>
        Don’t have an account? Sign up
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fefefe" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  input: { width: "80%", padding: 12, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, marginBottom: 12 },
  btn: { backgroundColor: "#007bff", padding: 14, borderRadius: 10, width: "80%", alignItems: "center" },
  btnText: { color: "white", fontWeight: "600" },
  link: { marginTop: 10, color: "#007bff" }
});
