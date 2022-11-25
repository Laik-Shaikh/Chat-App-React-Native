import React, { useCallback, useLayoutEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Avatar } from "react-native-elements";
import { EvilIcons, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { auth, db } from "../firebase";
import {
  serverTimestamp,
  collection,
  doc,
  setDoc,
  addDoc,
  query,
  orderBy,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { color } from "react-native-elements/dist/helpers";

const ChatScreen = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = React.useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      headerTintColor: "white",
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <EvilIcons name="user" size={50} color="white" />
          <Text
            style={{
              color: "white",
              marginLeft: 10,
              fontWeight: "700",
              fontSize: 20,
            }}
          >
            {route.params.chatName}
          </Text>
        </View>
      ),
    });
  }, []);

  React.useLayoutEffect(() => {
    (async () => {
      const queries = query(
        collection(db, `chats/${route.params.id}/messages`),
        orderBy("timestamp", "asc")
      );
      onSnapshot(queries, async (querySnapshot) => {
        const newMessages = [];
        const response = await querySnapshot.forEach((doc) => {
          newMessages.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setMessages(newMessages);
      });
    })();
  }, []);

  const sendMessage = async () => {
    Keyboard.dismiss();
    addDoc(collection(db, `chats/${route.params.id}/messages`), {
      timestamp: serverTimestamp(),
      message: input,
      displayName: auth.currentUser.displayName,
      photoURL: auth.currentUser.photoURL,
      email: auth.currentUser.email,
    });
    setInput("");
  };

  return (
    <View style={styles.Container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={styles.keyBoard}
        keyboardVerticalOffset={90}
      >
        <>
          <ScrollView>
            {messages.map(({ id, data }) =>
              data.email === auth.currentUser.email ? (
                <View key={id} style={styles.sender}>
                  <Avatar
                    position="absolute"
                    rounded
                    source={{
                      uri: data.photoURL,
                    }}
                    bottom={-15}
                    right={-5}
                    size={30}
                    // WEB
                    containerStyle={{
                      position: "absolute",
                      bottom: -15,
                      right: -5,
                    }}
                  />
                  <Text style={styles.senderText}>{data.message}</Text>
                  {/* <Text style={styles.senderName}>
                                {data.displayName}
                            </Text> */}
                </View>
              ) : (
                <View key={id} style={styles.reciever}>
                  <Avatar
                    position="absolute"
                    rounded
                    source={{
                      uri: data.photoURL,
                    }}
                    bottom={-15}
                    left={-5}
                    size={30}
                    // WEB
                    containerStyle={{
                      position: "absolute",
                      bottom: -15,
                      left: -5,
                    }}
                  />
                  <Text style={styles.recieverText}>{data.message}</Text>
                  <Text style={styles.recieverName}>{data.displayName}</Text>
                </View>
              )
            )}
          </ScrollView>
          <View style={styles.footer}>
            <TextInput
              style={styles.inputContainer}
              placeholder="Enter a Message"
              onChangeText={(text) => setInput(text)}
              value={input}
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity activeOpacity={0.5} onPress={() => sendMessage()}>
              <Ionicons name="send" size={24} color="#2B68E6" />
            </TouchableOpacity>
            <View style={{ marginTop: 10 }}></View>
          </View>
        </>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: "white",
  },

  keyBoard: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  inputContainer: {
    bottom: 0,
    height: 40,
    flex: 1,
    borderColor: "transparent",
    borderColor: "#ECECEC",
    borderWidth: 1,
    padding: 10,
    color: "black",
    borderRadius: 30,
    marginRight: 5,
  },
  sender: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 15,
    maxWidth: "80%",
    position: "relative",
  },
  reciever: {
    padding: 15,
    backgroundColor: "#2B68E6",
    alignSelf: "flex-start",
    borderRadius: 20,
    margin: 15,
    maxWidth: "80%",
    position: "relative",
  },
  senderText: {
    color: "black",
    fontWeight: "500",
    marginLeft: 5,
  },
  //   senderName: {
  //     left: 10,
  //     paddingRight: 10,
  //     fontSize: 12
  //   },
  recieverText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 5,
    marginBottom: 5,
  },
  recieverName: {
    left: 10,
    paddingRight: 10,
    fontSize: 12,
    color: "white",
  },
});
