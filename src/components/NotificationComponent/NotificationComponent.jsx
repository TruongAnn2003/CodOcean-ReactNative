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
  Platform,
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

const { width } = Dimensions.get("window");

const NotificationComponent = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);
  const { profile } = useSelector((state) => state.profile);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const loader = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [hasMoreNotifications, setHasMoreNotifications] = useState(true);

  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      let token;
      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          alert("Failed to get push token for push notification!");
          return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        setExpoPushToken(token);
      } else {
        alert("Must use physical device for Push Notifications");
      }

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      return token;
    };

    registerForPushNotificationsAsync();

    // const scheduleSampleNotification = async () => {
    //   await Notifications.scheduleNotificationAsync({
    //     content: {
    //       title: "Common Notification",
    //       body: "Admin just sent you a notification!",
    //       data: {
    //         ownerImageUrl:
    //           "https://res.cloudinary.com/du5medjhm/image/upload/v1730821482/avatar-default_vxhm9l.png",
    //         ownerName: "Hoang",
    //         message: "Admin just sent you a notification!",
    //         date: new Date().toISOString(),
    //       },
    //     },
    //     trigger: { seconds: 5 }, // Triggers after 5 seconds
    //   });
    // };

    // scheduleSampleNotification();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(
          "Notification Received:",
          notification.request.content.data
        );
        setNotifications((prev) => [
          notification.request.content.data,
          ...prev,
        ]);
        setUnreadCount((prev) => prev + 1);

        console.log("Notifications:", notifications);
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
    console.log("Message in notification component:", message);
    if (message.content) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Common Notification",
          body: message.content,
          data: {
            id: message.id,
            content: message.content,
            receivedTime: message.receivedTime,
            isRead: message.isRead,
            ownerImageUrl: message.ownerImageUrl,
            ownerName: message.ownerName,
          },
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
    <TouchableOpacity
      className={`p-4 rounded-lg shadow-md ${
        item.read ? "bg-gray-200" : "bg-blue-50"
      }`}
      onPress={() => !item.read && markAsRead(item.id)}
    >
      <View className="flex flex-row items-center">
        <Avatar.Image
          size={50}
          source={{
            uri: item.ownerImageUrl || "default_image_url",
          }}
          className="mr-4"
        />
        <View className="flex-1">
          <Text className="font-bold text-lg text-blue-900">
            {item.ownerName || "Unknown"}
          </Text>
          <Text className="text-blue-700">{item.content || ""}</Text>
          <Text className="text-sm text-blue-600">
            {item.receivedTime
              ? new Date(item.receivedTime).toLocaleTimeString()
              : ""}
          </Text>
        </View>
        {!item.read && <View className="w-3 h-3 bg-red-500 rounded-full" />}
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    dispatch(getNotifications()).then((action) => {
      if (getNotifications.fulfilled.match(action)) {
        setNotifications(action.payload);
        setUnreadCount(action.payload.filter((n) => !n.read).length);
      }
    });
  }, [dispatch]);

  const fetchNotifications = async (pageNumber) => {
    setIsLoading(true);
    try {
      const limit = 5;
      const resultAction = await dispatch(
        getNotifications({ pageNumber, limit })
      );
      if (getNotifications.fulfilled.match(resultAction)) {
        const filteredNotifications = resultAction.payload.filter(
          (notification) => notification.content
        );
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          ...filteredNotifications,
        ]);
        setUnreadCount(
          (prevUnreadCount) =>
            prevUnreadCount +
            filteredNotifications.filter((n) => !n.read).length
        );
        if (filteredNotifications.length <= 0) {
          setHasMoreNotifications(false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(pageNumber);
  }, [dispatch, pageNumber]);

  const handleScroll = (e) => {
    e.stopPropagation();
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 30) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
  };

  return (
    <View className="relative">
      <TouchableOpacity
        onPress={() => setIsNotificationOpen(true)}
        className="p-3 relative"
      >
        <Icon name="bell" size={24} color="#FF6B6B" />
        {unreadCount > 0 && (
          <View className="absolute top-2 right-2 bg-green-500 min-w-[18px] h-[18px] rounded-full flex justify-center items-center">
            <Text className="text-white text-xs font-semibold">
              {unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={isNotificationOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsNotificationOpen(false)}
      >
        <View className="flex-1 bg-black bg-opacity-50">
          <View className="bg-white mt-15 flex-1 rounded-t-2xl shadow-lg">
            <View className="flex-row justify-between items-center p-5 border-b border-gray-200">
              <View className="flex-row items-center">
                <Text className="text-xl font-bold text-gray-900">
                  Notifications
                </Text>
                {unreadCount > 0 && (
                  <View className="bg-blue-500 px-2 py-1 rounded-full ml-2">
                    <Text className="text-white text-sm font-semibold">
                      {unreadCount}
                    </Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                className="p-1"
                onPress={() => setIsNotificationOpen(false)}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {unreadCount > 0 && (
              <TouchableOpacity
                className="flex-row items-center p-4 bg-gray-100 mx-4 my-2 rounded-lg"
                onPress={markAllAsRead}
              >
                <Icon name="check-circle" size={20} color="#1A73E8" />
                <Text className="ml-2 text-blue-600 font-semibold">
                  Mark all as read
                </Text>
              </TouchableOpacity>
            )}

            <FlatList
              data={notifications}
              renderItem={renderNotificationItem}
              keyExtractor={(item) => item.id}
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle="px-4"
              onScroll={handleScroll}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default NotificationComponent;
