import { useState, useLayoutEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Icon, Input } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";
import { auth, db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const AddChats = ({ navigation }) => {
  const [chatName, setChatName] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a New Chat",
    });
  }, [navigation]);

  const addChatName = async () => {
    addDoc(collection(db, `chats`), {
      chatName: chatName,
    })
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Enter the Chat Name"
        value={chatName}
        onChangeText={(text) => setChatName(text)}
        leftIcon={
          <Icon name="wechat" type="antdesign" size={24} color="black" />
        }
        onSubmitEditing={addChatName}
      />
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={addChatName}
        style={styles.button}
      >
        <Text style={styles.addChatText}>Create New Chat</Text>
      </TouchableOpacity>
    </View>
  );
};
export default AddChats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  addChatText: {
    textAlign: "center",
    marginTop: 7,
    fontSize: 17,
    color: "white",
  },
  button: {
    height: 40,
    width: 220,
    borderRadius: 10,
    backgroundColor: "#24a0ed",
    marginTop: 10,
  },
});
