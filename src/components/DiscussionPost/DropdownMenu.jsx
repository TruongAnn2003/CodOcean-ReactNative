import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

function DropdownMenu({ onEdit, onDelete }) {
  return (
    <View className="absolute right-2 top-9 bg-white rounded-lg shadow-md min-w-[150px] py-1">
      <TouchableOpacity 
        onPress={onEdit}
        className="flex-row items-center px-4 py-3 hover:bg-gray-50"
      >
        <FontAwesomeIcon 
          icon={faEdit} 
          size={16}
          className="text-gray-600" 
        />
        <Text className="ml-3 text-sm font-medium text-gray-600">
          Chỉnh sửa
        </Text>
      </TouchableOpacity>

      <View className="h-[1px] bg-gray-100" />

      <TouchableOpacity
        onPress={onDelete}
        className="flex-row items-center px-4 py-3 hover:bg-gray-50"
      >
        <FontAwesomeIcon 
          icon={faTrash} 
          size={16}
          className="text-red-600"
        />
        <Text className="ml-3 text-sm font-medium text-red-600">
          Xóa
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default React.memo(DropdownMenu);
