import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Comment from "./Comment";

export default function CommentSection({
  comments,
  onAddComment,
  onReply,
  onEditComment,
  onDeleteComment,
}) {
  const [commentText, setCommentText] = useState("");

  const handleAddComment = () => {
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText("");
    }
  };

  return (
    <View className={"mt-6"}>
      <Text className={"text-lg font-semibold mb-4"}>Comments</Text>

      {/* Comment Input Form */}
      <View className={"flex-row mb-4"}>
        <TextInput
          className={"flex-1 p-2 border rounded-lg"}
          placeholder="Add a comment..."
          value={commentText}
          onChangeText={(text) => setCommentText(text)}
        />
        <TouchableOpacity
          className={"px-4 py-2 bg-blue-500 rounded-lg ml-2"}
          onPress={handleAddComment}
        >
          <FontAwesome name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Display Comments List */}
      <ScrollView>
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onReply={onReply}
            onEditComment={onEditComment}
            onDeleteComment={onDeleteComment}
          />
        ))}
      </ScrollView>
    </View>
  );
}
