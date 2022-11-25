import React, { useLayoutEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { Text, Input } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
//import ImagePicker from 'react-native-image-picker/src';
//import ImagePicker from 'react-native-image-picker/lib/commonjs'

import { auth } from "../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";
import { uploadBytes, getDownloadURL } from "firebase/storage";

const Register = ({ navigation }) => {
  const storage = getStorage();
  const metadata = {
    contentType: "image/jpg" || "image/jpeg" || "image/png",
  };

  const uri =
    "https://firebasestorage.googleapis.com/v0/b/my-image-bucket-b421d.appspot.com/o/Icons%2Fadd-contact.png?alt=media&token=6582cf3d-268e-413d-9f9c-ee9425dda8f6";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUri, setImageUri] = useState(null);

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerBackTitle: "Login"
  //   })
  // }, [navigation])

  const uploadImageToFirebase = async () => {
    try {
      // console.log(imageUri[0].uri)
      const response = await fetch(imageUri[0].uri);

      const blobFile = await response.blob();

      const storageRef = ref(
        storage,
        `User_Profile_Image/${name}-${Date.now()}.jpg`
      );
      const result = await uploadBytes(storageRef, blobFile, metadata);

      const url = await getDownloadURL(storageRef);
      //console.log(url);
      return url;
    } catch (error) {
      alert("Something Went wrong");
      return Promise.reject(error);
    }
  };

  const pickImage = async () => {
    // Ask the user for the permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    // Explore the result
    // console.log(result);
    // console.log(imageUri)

    if (!result.canceled) {
      setImageUri(result.assets);
      //console.log(result.assets);
    }
  };

  const register = async () => {
    if (!name) {
      return alert("Name is Required");
    }

    if (email.length === 0) {
      return alert("email address must be enter");
    }

    if (password.length === 0) {
      return alert("Password is Required Field");
    } else if (password.length < 8) {
      return alert("Password must be greater than 8 character");
    }

    let result;
    if (imageUri) {
      result = await uploadImageToFirebase();
    }
    const photoUrl =
      result ||
      "https://firebasestorage.googleapis.com/v0/b/my-image-bucket-b421d.appspot.com/o/Icons%2Faccount.png?alt=media&token=06462e6b-8fc1-478c-890d-1a066cb0c083";

    createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password)
      .then((userCredential) => {
        updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: photoUrl,
        })
          .then(() => {
            alert("Account Created Successfully");
            navigation.navigate("Login");
          })
          .catch((error) => {
            console.log(error.code);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === "auth/invalid-email") {
          alert("Enter a Valid Email Address");
        }
        if (errorCode === "auth/email-already-in-use") {
          return alert("Email Address Already Exists");
        }
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <StatusBar style="light" />
      {/* <Image source={{ uri: imageUri }} style={styles.registerIcon} /> */}
      {imageUri ? (
        <Image
          source={{ uri: imageUri[0].uri }}
          style={styles.userProfileIcon}
        />
      ) : (
        <Image source={{ uri: uri }} style={styles.registerIcon} />
      )}
      <Text h3 style={{ marginTop: 10, marginBottom: 30 }}>
        Create Your Account
      </Text>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Enter Your Full Name"
          type="text"
          value={name}
          onChangeText={(text) => setName(text)}
          style={styles.input}
        />
        <Input
          placeholder="Enter Your Email"
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <Input
          placeholder="Enter Password"
          type="password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
        />
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={pickImage}
            style={styles.uploadYourImage}
          >
            <Text style={styles.uploadYourImageText}>
              Upload Your Image(optional)
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={register}
            style={styles.button}
          >
            <Text style={styles.loginText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={styles.button2}
            activeOpacity={0.5}
          >
            <Text style={styles.registerText}>Already have an Account?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  registerIcon: {
    marginTop: 25,
    height: 100,
    width: 100,
  },
  userProfileIcon: {
    marginTop: 25,
    height: 150,
    width: 150,
    borderRadius: 20,
  },
  inputContainer: {
    width: 320,
    marginBottom: 10,
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
  uploadYourImage: {
    width: 250,
    borderRadius: 10,
    backgroundColor: "#0000ff",
    marginBottom: 20,
    padding: 4,
  },
  uploadYourImageText: {
    padding: 10,
    textAlign: "center",
    color: "white",
  },
  loginText: {
    textAlign: "center",
    marginTop: 7,
    fontSize: 17,
    color: "white",
  },
  registerText: {
    textAlign: "center",
    marginTop: 7,
    fontSize: 17,
    color: "#2196F3",
  },
  input: {
    padding: 10,
  },
});

export default Register;
