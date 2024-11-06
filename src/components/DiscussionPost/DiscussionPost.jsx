import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import CommentSection from "./CommentSection";
import DropdownMenu from "./DropdownMenu";

export default function DiscussionPost({ post }) {
  const [comments, setComments] = useState(post.comments || []);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showFullImages, setShowFullImages] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleAddComment = (text) => {
    const newComment = {
      id: Date.now(),
      text: text,
      updatedAt: new Date().toISOString(),
      ownerId: "currentUserId",
      ownerName: "Current User",
      ownerImageUrl:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
      replies: [],
    };
    setComments([newComment, ...comments]);
  };

  const handleReply = (commentId, replyText) => {
    const newReply = {
      id: Date.now(),
      text: replyText,
      updatedAt: new Date().toISOString(),
      ownerId: "currentUserId",
      ownerName: "Current User",
      ownerImageUrl:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
    };
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? { ...comment, replies: [...comment.replies, newReply] }
          : comment
      )
    );
  };

  const handleEditComment = (commentId) => {
    console.log(`Edit comment with ID: ${commentId}`);
  };

  const handleDeleteComment = (commentId) => {
    setComments(comments.filter((comment) => comment.id !== commentId));
  };

  const toggleDescription = () => setShowFullDescription(!showFullDescription);
  const toggleImages = () => setShowFullImages(!showFullImages);

  const isPostLocked = () => new Date(post.endAt) < new Date();
  const lockMessage = () => {
    const now = new Date();
    const endAtDate = new Date(post.endAt);
    if (endAtDate < now) {
      return "This post is locked";
    }
    const timeLeft = Math.ceil((endAtDate - now) / (1000 * 60 * 60 * 24));
    return `This post will be locked in ${timeLeft} days`;
  };

  return (
    <View style={`bg-white rounded-lg shadow-lg p-4 mb-6`}>
      <View style={`flex-row justify-beeen items-center mb-4`}>
        <View style={`flex-row items-center`}>
          <Image
            source={{ uri: post.ownerImageUrl }}
            style={`w-12 h-12 rounded-full mr-4`}
            onError={({ nativeEvent }) => {
              nativeEvent.target.src = "https://via.placeholder.com/150";
            }}
          />
          <View>
            <Text style={`text-lg font-semibold`}>{post.ownerName}</Text>
            <Text style={`text-gray-500 text-sm`}>
              {new Date(post.createdAt).toLocaleString()}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setShowOptions(!showOptions)}
          style={`text-gray-500`}
        >
          <FontAwesome name="ellipsis-h" size={20} color="gray" />
        </TouchableOpacity>
        {showOptions && (
          <DropdownMenu
            onEdit={() => console.log("Edit post")}
            onDelete={() => console.log("Delete post")}
          />
        )}
      </View>

      <Text style={`text-2xl font-bold text-gray-800 mb-2`}>{post.title}</Text>

      <Text style={`text-gray-700 mb-4`}>
        {showFullDescription
          ? post.description
          : `${post.description.slice(0, 150)}...`}
        {post.description.length > 150 && (
          <TouchableOpacity onPress={toggleDescription}>
            <Text style={`text-blue-500 text-sm ml-1`}>
              {showFullDescription ? "Show less" : "Show more"}
            </Text>
          </TouchableOpacity>
        )}
      </Text>

      <View style={`mb-4`}>
        <Text style={`font-semibold mb-2`}>Categories:</Text>
        <View style={`flex-row flex-wrap gap-2`}>
          {post.categories.map((category, index) => (
            <View key={index} style={`bg-blue-100 px-3 py-1 rounded-full`}>
              <Text style={`text-blue-800 text-sm font-semibold`}>
                {category.name}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {post.imageUrls && post.imageUrls.length > 0 && (
        <View style={`flex-row flex-wrap mb-4`}>
          {post.imageUrls
            .slice(0, showFullImages ? post.imageUrls.length : 2)
            .map((url, index) => (
              <Image
                key={index}
                source={{ uri: url }}
                style={`w-full h-48 rounded-lg mb-2`}
              />
            ))}
          {post.imageUrls.length > 2 && (
            <TouchableOpacity onPress={toggleImages}>
              <Text style={`text-blue-500 text-sm`}>
                {showFullImages ? "Show less" : "Show more"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={`flex-row justify-beeen items-center mt-4`}>
        <TouchableOpacity style={`flex-row items-center`}>
          <FontAwesome
            name="heart"
            size={24}
            color={post.isLiked ? "red" : "gray"}
          />
          <Text style={`ml-2`}>{post.reactCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={`flex-row items-center`}>
          <FontAwesome name="comment" size={24} color="gray" />
          <Text style={`ml-2`}>{comments.length}</Text>
        </TouchableOpacity>
        <Text style={`text-gray-400 text-sm`}>
          {new Date(post.updatedAt).toLocaleString()}
        </Text>
      </View>

      <View
        style={`mt-4 p-3 rounded-lg ${
          isPostLocked() ? "bg-red-100" : "bg-yellow-100"
        }`}
      >
        <View style={`flex-row items-center`}>
          <FontAwesome
            name="lock"
            size={16}
            color={isPostLocked() ? "red" : "orange"}
          />
          <Text style={`ml-2`}>{lockMessage()}</Text>
        </View>
      </View>

      <CommentSection
        comments={comments}
        onAddComment={handleAddComment}
        onReply={handleReply}
        onEditComment={handleEditComment}
        onDeleteComment={handleDeleteComment}
      />
    </View>
  );
}
