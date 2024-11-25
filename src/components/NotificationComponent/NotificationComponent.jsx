import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Avatar } from "react-native-paper";
import Icon from "react-native-vector-icons/Feather";
import { useSelector, useDispatch } from "react-redux";
import {
  getNotifications,
  setNotificationRead,
  setAllNotificationsRead,
} from "./services/slice";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import useWebSocket from "../../hooks/useWebSocket";

// Thiết lập handler cho thông báo
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Hàm đăng ký thông báo đẩy
async function registerForPushNotificationsAsync(setExpoPushToken) {
  try {
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        throw new Error("Permission not granted for push notifications!");
      }

      const pushToken = (await Notifications.getExpoPushTokenAsync()).data;
      setExpoPushToken(pushToken);
      console.log("Expo Push Token:", pushToken);
      return pushToken;
    } else {
      throw new Error("Must use physical device for push notifications");
    }
  } catch (error) {
    console.error("Error registering for push notifications:", error);
  }
}

const NotificationComponent = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);
  const { profile } = useSelector((state) => state.profile);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync(setExpoPushToken);

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // Thêm thông báo vừa nhận vào danh sách thông báo
        setNotifications((prev) => [notification.request.content, ...prev]);
        setUnreadCount((prev) => prev + 1); // Tăng số lượng thông báo chưa đọc
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification Response:", response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const handleWebSocketMessage = (message) => {
    if (message.content) {
      // Push thông báo tới thiết bị
      Notifications.scheduleNotificationAsync({
        content: {
          title: message.title || "New Notification",
          body: message.content,
          data: message,
        },
        trigger: null,
      });

      setNotifications((prevNotifications) => [message, ...prevNotifications]);
      setUnreadCount((prevUnreadCount) => prevUnreadCount + 1);
    }
  };

  useWebSocket(handleWebSocketMessage, `/topic/notification/broadcast/${role}`);
  useWebSocket(
    handleWebSocketMessage,
    `/topic/notification/personal/${profile?.email}`
  );

  const markAllAsRead = async () => {
    try {
      const resultAction = await dispatch(setAllNotificationsRead());
      if (setAllNotificationsRead.fulfilled.match(resultAction)) {
        const newNotifications = notifications.map((notification) => ({
          ...notification,
          read: true,
        }));
        setNotifications(newNotifications);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      const resultAction = await dispatch(setNotificationRead(id));
      if (setNotificationRead.fulfilled.match(resultAction)) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === id
              ? { ...notification, read: true }
              : notification
          )
        );
        setUnreadCount((prevUnreadCount) => prevUnreadCount - 1);
      }
    } catch (error) {
      console.error(`Failed to mark notification ${id} as read:`, error);
    }
  };

  const renderNotificationItem = ({ item }) => (
    <View
      style={{
        padding: 10,
        backgroundColor: item.read ? "#f0f0f0" : "#fff",
        borderBottomWidth: 1,
        borderColor: "#ccc",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Avatar.Image size={40} source={{ uri: item.ownerImageUrl }} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={{ fontWeight: "bold" }}>{item.ownerName}</Text>
          <Text>{item.content}</Text>
        </View>
        {!item.read && (
          <TouchableOpacity onPress={() => markAsRead(item.id)}>
            <Icon name="check" size={24} color="#048cbf" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View>
      <TouchableOpacity
        onPress={() => setIsNotificationOpen(!isNotificationOpen)}
        style={{ position: "relative", padding: 10 }}
      >
        <Icon name="bell" size={24} color="#048cbf" />
        {unreadCount > 0 && (
          <View
            style={{
              position: "absolute",
              top: -5,
              right: -5,
              backgroundColor: "red",
              borderRadius: 10,
              padding: 5,
            }}
          >
            <Text style={{ color: "white", fontSize: 12 }}>{unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
      {isNotificationOpen && (
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 10,
            padding: 10,
            maxHeight: 300,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingBottom: 10,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              Notifications
            </Text>
            <TouchableOpacity onPress={markAllAsRead}>
              <Text style={{ color: "blue" }}>Mark all as read</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      )}
    </View>
  );
};

export default NotificationComponent;
