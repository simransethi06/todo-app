import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => navigation.replace("Home"))
      .catch(err => Alert.alert("Signup Error", err.message));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account 🌸</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.btn} onPress={handleSignup}>
        <Text style={styles.btnText}>Sign Up</Text>
      </TouchableOpacity>

      <Text onPress={() => navigation.navigate("Login")} style={styles.link}>
        Already have an account? Login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fefefe",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontWeight: "600",
  },
  link: {
    marginTop: 10,
    color: "#007bff",
  },
});
