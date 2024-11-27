import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Pressable,
  Dimensions,
  Image,
} from "react-native";
import { Avatar } from "react-native-paper";
import Icon from "react-native-vector-icons/Feather";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  getNotifications,
  setNotificationRead,
  setAllNotificationsRead,
} from "./services/slice";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import useWebSocket from "../../hooks/useWebSocket";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync(setExpoPushToken) {
  try {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
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

const { width } = Dimensions.get("window");

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

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotifications((prev) => [notification.request.content, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification Response:", response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
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
  useWebSocket(handleWebSocketMessage, `/topic/notification/personal/${profile?.email}`);

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
            notification.id === id ? { ...notification, read: true } : notification
          )
        );
        setUnreadCount((prevUnreadCount) => prevUnreadCount - 1);
      }
    } catch (error) {
      console.error(`Failed to mark notification ${id} as read:`, error);
    }
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        { backgroundColor: item.read ? "#F8F9FA" : "#FFFFFF" },
      ]}
      onPress={() => !item.read && markAsRead(item.id)}
    >
      <View style={styles.notificationContent}>
        <Avatar.Image 
          size={50} 
          source={{ uri: item.ownerImageUrl }} 
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={styles.ownerName}>{item.ownerName}</Text>
          <Text style={styles.notificationText}>{item.content}</Text>
          <Text style={styles.timeText}>2 hours ago</Text>
        </View>
        {!item.read && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    dispatch(getNotifications()).then((action) => {
      if (getNotifications.fulfilled.match(action)) {
        setNotifications(action.payload);
        setUnreadCount(action.payload.filter(n => !n.read).length);
      }
    });
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setIsNotificationOpen(true)}
        style={styles.bellContainer}
      >
        <Icon name="bell" size={24} color="#FF6B6B" />
        {unreadCount > 0 && (
          <View style={[styles.badge, { backgroundColor: '#28A745' }]}>
            <Text style={[styles.badgeText, { color: '#FFFFFF' }]}>{unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={isNotificationOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsNotificationOpen(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.headerLeft}>
                <Text style={styles.modalTitle}>Notifications</Text>
                {unreadCount > 0 && (
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{unreadCount}</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setIsNotificationOpen(false)}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            {unreadCount > 0 && (
              <TouchableOpacity 
                style={styles.markAllButton} 
                onPress={markAllAsRead}
              >
                <Icon name="check-circle" size={20} color="#1A73E8" />
                <Text style={styles.markAllText}>Mark all as read</Text>
              </TouchableOpacity>
            )}

            <FlatList
              data={notifications}
              renderItem={renderNotificationItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.notificationList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          </View>
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
    padding: 12,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FF4444",
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    marginTop: 60,
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  countBadge: {
    backgroundColor: "#1A73E8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  countText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
  },
  markAllButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#F8F9FA",
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 8,
  },
  markAllText: {
    marginLeft: 8,
    color: "#1A73E8",
    fontWeight: "600",
  },
  notificationList: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 15,
  },
  notificationItem: {
    marginVertical: 8,
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    backgroundColor: "#F0F0F0",
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
    marginRight: 25,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  notificationText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  timeText: {
    fontSize: 12,
    color: "#999999",
    marginTop: 6,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1A73E8",
    position: "absolute",
    right: 0,
  },
});

export default NotificationComponent;
