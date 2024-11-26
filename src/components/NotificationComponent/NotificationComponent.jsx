import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Pressable,
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
        setNotifications((prev) => [notification.request.content, ...prev]);
        setUnreadCount((prev) => prev + 1);
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
      style={[
        styles.notificationItem,
        { backgroundColor: item.read ? "#f0f0f0" : "#fff" },
      ]}
    >
      <Avatar.Image size={40} source={{ uri: item.ownerImageUrl }} />
      <View style={styles.notificationTextContainer}>
        <Text style={styles.ownerName}>{item.ownerName}</Text>
        <Text>{item.content}</Text>
      </View>
      {!item.read && (
        <TouchableOpacity onPress={() => markAsRead(item.id)}>
          <Icon name="check" size={24} color="#048cbf" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setIsNotificationOpen(true)}
        style={styles.bellContainer}
      >
        <Icon name="bell" size={24} color="#048cbf" />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={isNotificationOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsNotificationOpen(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setIsNotificationOpen(false)}
        />
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Notifications</Text>
            <TouchableOpacity onPress={markAllAsRead}>
              <Text style={styles.markAllText}>Mark all as read</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.notificationList}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  bellContainer: {
    padding: 10,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    padding: 5,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 15,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  markAllText: {
    color: "blue",
  },
  notificationList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  notificationTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  ownerName: {
    fontWeight: "bold",
  },
});

export default NotificationComponent;
