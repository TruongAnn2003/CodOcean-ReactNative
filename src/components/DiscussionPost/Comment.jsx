import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const Comment = ({ comment, onReply, onEditComment, onDeleteComment }) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleReply = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText("");
      setShowReplyInput(false);
    }
  };

  return (
    <View className ={"ml-8 mb-4 relative"}>
      <View className ={"flex-row items-center justify-between mb-2"}>
        <View className ={"flex-row items-center"}>
          <Image
            source={{ uri: comment.ownerImageUrl }}
            className ={"w-8 h-8 rounded-full mr-2"}
            onError={() => {
              this.source = { uri: "https://via.placeholder.com/150" };
            }}
          />
          <View>
            <Text className ={"font-semibold"}>{comment.ownerName}</Text>
            <Text className ={"text-gray-400 text-xs"}>
              {new Date(comment.updatedAt).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Dropdown Icon */}
        <TouchableOpacity
          onPress={() => setShowOptions(!showOptions)}
          className ={"text-gray-500"}
        >
          <FontAwesome name="ellipsis-h" size={20} className ={"text-gray-500"} />
        </TouchableOpacity>
        {showOptions && (
          <View
            className ={"absolute right-0 top-10 bg-white shadow-lg rounded-lg p-2"}
          >
            <TouchableOpacity
              onPress={() => onEditComment(comment.id)}
              className ={"p-2"}
            >
              <Text className ={"text-blue-500"}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onDeleteComment(comment.id)}
              className ={"p-2"}
            >
              <Text className ={"text-red-500"}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Text className ={"mb-2"}>{comment.text}</Text>

      {/* Show Reply Input */}
      <TouchableOpacity
        onPress={() => setShowReplyInput(!showReplyInput)}
        className ={"text-blue-500 text-sm mb-2"}
      >
        <Text className ={"text-blue-500 text-sm"}>Reply</Text>
      </TouchableOpacity>

      {/* Reply Input Form */}
      {showReplyInput && (
        <View className ={"flex-row space-x-2 mb-2"}>
          <TextInput
            className ={"flex-1 p-2 border rounded-lg focus:outline-none"}
            placeholder="Add a reply..."
            value={replyText}
            onChangeText={(text) => setReplyText(text)}
          />
          <TouchableOpacity
            className ={"px-4 py-2 bg-blue-500 rounded-lg"}
            onPress={handleReply}
          >
            <FontAwesome name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* Display Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <View className ={"ml-8"}>
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onEditComment={onEditComment}
              onDeleteComment={onDeleteComment}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default Comment;
