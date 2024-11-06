import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function DropdownMenu({ onEdit, onDelete }) {
  return (
    <View
      className={
        "absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg"
      }
    >
      <View>
        <TouchableOpacity
          className={"px-4 py-2 hover:bg-gray-100"}
          onPress={onEdit}
        >
          <Text className={"flex-row items-center"}>
            <FontAwesomeIcon icon={faEdit} className={"mr-2"} /> Edit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={"px-4 py-2 hover:bg-gray-100"}
          onPress={onDelete}
        >
          <Text className={"flex-row items-center"}>
            <FontAwesomeIcon icon={faTrash} className={"mr-2"} />
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
