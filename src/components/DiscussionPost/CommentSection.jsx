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
import { getComments } from "../../services/redux-toolkit/reducers/discussionSlice";

function CommentSection({ comments, onAddComment, onDeleteComment }) {
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
          <Comment
            key={comment.id}
            comment={comment}
            onDeleteComment={onDeleteComment}
          />
        ))}
      </ScrollView>
    </View>
  );
}
export default React.memo(CommentSection);
