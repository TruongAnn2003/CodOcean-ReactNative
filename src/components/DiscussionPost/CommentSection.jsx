import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Comment from "./Comment";
import CommentInputBox from "./CommentInputBox";

function CommentSection({ comments, onAddComment }) {
  const handleAddComment = (commentText) => {
    if (commentText.trim()) {
      onAddComment(commentText);
    }
  };

  return (
    <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}
      >
        <CommentInputBox onSubmit={handleAddComment} />
      </View>
      <ScrollView>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </ScrollView>
    </View>
  );
}
export default React.memo(CommentSection);
