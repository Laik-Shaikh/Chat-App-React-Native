import React from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { useState, useEffect, useLayoutEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ListItem, Avatar } from "react-native-elements";

import { auth, db } from "../firebase";

const ChatList = ({ navigation, id, chatName, enterChat }) => {
  const [messages, setMessages] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      const queries = query(
        collection(db, `chats/${id}/messages`),
        orderBy("timestamp", "desc")
      );

      onSnapshot(queries, async (querySnapShot) => {
        const getMesssages = [];
        await querySnapShot.forEach((doc) => {
          getMesssages.push({
            data: doc.data(),
          });
        });
        setMessages(getMesssages);
      });
    })();
  }, []);

  return (
    <ListItem key={id} onPress={() => enterChat(id, chatName)} bottomDivider>
      <Avatar
        rounded
        source={{
          uri:
            messages[0]?.data?.photoURL ||
            "https://firebasestorage.googleapis.com/v0/b/my-image-bucket-b421d.appspot.com/o/Icons%2Faccount.png?alt=media&token=06462e6b-8fc1-478c-890d-1a066cb0c083",
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: "800" }}>
          {chatName}
        </ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
          {messages[0]?.data?.displayName} : {messages[0]?.data?.message}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default ChatList;

const styles = StyleSheet.create({});
