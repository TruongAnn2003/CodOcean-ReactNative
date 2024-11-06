import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import PropTypes from "prop-types";

export function Comment({ comment }) {
  const { text, updatedAt, ownerName, ownerImageUrl } = comment;

  return (
    <View style={styles.commentContainer}>
      <Image source={{ uri: ownerImageUrl }} style={styles.commentOwnerImage} />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentOwnerName}>{ownerName}</Text>
          <Text style={styles.commentDate}>
            {updatedAt ? new Date(updatedAt).toLocaleString() : "Unknown date"}
          </Text>
        </View>
        <Text style={styles.commentText}>{text}</Text>
      </View>
    </View>
  );
}

Comment.propTypes = {
  comment: PropTypes.shape({
    text: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    ownerName: PropTypes.string.isRequired,
    ownerImageUrl: PropTypes.string,
  }).isRequired,
};

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    marginVertical: 8,
  },
  commentOwnerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
    flexDirection: "column",
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  commentOwnerName: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#333",
  },
  commentText: {
    fontSize: 14,
    color: "#555",
  },
  commentDate: {
    fontSize: 12,
    color: "#999",
  },
});
