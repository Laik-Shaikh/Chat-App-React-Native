import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { Avatar } from "react-native-elements";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

import ChatList from "./ChatList";

const Home = ({ navigation }) => {
  const [chats, setChats] = React.useState([]);

  React.useEffect(() => {
    (async function () {
      const queries = query(collection(db, "chats"));
      onSnapshot(queries, async (querySnapShot) => {
        const getChats = [];
        await querySnapShot.forEach((doc) => {
          getChats.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setChats(getChats);
      });
    })();
  }, []);

  const signOutUser = () => {
    Alert.alert(
      "Logout",
      "Do You Want to Logout ? ",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          style: "default",
          onPress: () => {
            signOut(auth).then(() => {
              navigation.replace("Login");
            });
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {},
      }
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Your Chats",
      headerTitleStyle: { color: "black" },
      headerStyle: { backgroundColor: "white" },
      headerTintColor: "black",
      headerLeft: () => (
        <View style={{ marginLeft: 10 }}>
          <TouchableOpacity onPress={signOutUser} activeOpacity={0.5}>
            <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 80,
            marginRight: 10,
            marginLeft: 30,
          }}
        >
          <TouchableOpacity activeOpacity={0.5}>
            <AntDesign name="camerao" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Add Chats");
            }}
            activeOpacity={0.5}
          >
            <SimpleLineIcons name="pencil" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const enterChat = (id, chatName) => {
    navigation.navigate("Chat", {
      id,
      chatName,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      {chats.map(({ id, data: { chatName } }) => {
        return (
          <ChatList
            key={id}
            id={id}
            chatName={chatName}
            enterChat={enterChat}
          />
        );
      })}
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});
