import React, { useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Text,
} from "react-native";
import { Input, Button } from "react-native-elements";

import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth"

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // useEffect(() => {
  //   const result = auth.onAuthStateChanged((authUser) => {
  //     if (authUser) {
  //       alert("You are Register you can login");
  //        navigation.navigate("Home Screen")  // automatic login
  //     }
  //   });
  // }, []);

  const loginUser = () => {
    if (email.trim().length === 0) {
      return alert('email address must be enter');
    }

    if(!password){
      return alert("Enter a PassWord");
    } 

    signInWithEmailAndPassword(auth, email.trim(), password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
        if(user) {
          navigation.replace("Home");
          setEmail("");
          setPassword("")
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        //console.log(errorCode)
        if(errorCode === "auth/invalid-email") {
          alert("Enter a Valid Email Address")
        }
        if(errorCode === "auth/internal-error" || errorCode === "auth/user-not-found") {
          alert(`Email Address does not exists. \nAre you sure you are Registed ?`)
        }
        if(errorCode === "auth/wrong-password") {
          alert("Invalid Password")
        }
        if(errorCode === "auth/network-request-failed") {
          alert("Network Connection Failed")
        }
      });
  };

  const register = () => {
    navigation.navigate("Register");
    setEmail("");
    setPassword("");
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Image
        style={styles.loginImage}
        source={{
          uri: "https://firebasestorage.googleapis.com/v0/b/my-image-bucket-b421d.appspot.com/o/Icons%2Fmeetme.png?alt=media&token=4e460d45-66c1-434e-8fad-61bcbbfd776a",
        }}
      />
      <View style={styles.inputContainer}>
        <Input
          placeholder="Enter Email"
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={{ padding: 10 }}
        />
        <Input
          placeholder="Enter Password"
          type="password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={{ padding: 10 }}
        />
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity activeOpacity={0.5} style={styles.button} onPress={loginUser}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={register}
            style={styles.button2}
            activeOpacity={0.5}
          >
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 10 }}></View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  loginImage: {
    width: 200,
    height: 200,
  },
  container: {
    flex: 1,
    alignItems: "center", // x-axis
    justifyContent: "center", // y-axis
    padding: 10,
  },
  button: {
    height: 40,
    width: 220,
    borderRadius: 10,
    backgroundColor: "#24a0ed",
    marginTop: 10,
  },
  button2: {
    height: 40,
    width: 220,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#2196F3",
    marginTop: 10,
  },
  loginText: {
    textAlign: "center",
    marginTop: 5,
    fontSize: 19,
    color: "white",
    fontWeight: "600",
  },
  registerText: {
    textAlign: "center",
    marginTop: 5,
    fontSize: 19,
    color: "#2196F3",
    fontWeight: "600",
  },
  inputContainer: {
    width: 320,
    marginTop: 30,
  },
});

export default Login;
