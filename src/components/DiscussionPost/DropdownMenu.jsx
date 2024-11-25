import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

function DropdownMenu({ onEdit, onDelete }) {
  return (
    <View style={styles.menuContainer}>
      <View style={styles.menuItem}>
        <TouchableOpacity onPress={() => onEdit()} style={styles.menuItemButton}>
          <FontAwesomeIcon icon={faEdit} color="#333" size={20} />
          <Text style={styles.menuText}>Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.menuItem}>
        <TouchableOpacity
          onPress={() => onDelete()}
          style={styles.menuItemButton}
        >
          <FontAwesomeIcon icon={faTrash} color="#e74c3c" size={20} />
          <Text style={styles.menuText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    position: "absolute",
    right: 0,
    top: 40,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    borderColor: "#e5e5e5",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  menuItemButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
});

export default React.memo(DropdownMenu);
