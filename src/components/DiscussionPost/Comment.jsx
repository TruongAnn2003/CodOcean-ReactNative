import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import {
  getRepliesCommentById,
  deleteComment,
  updateComment,
  replyComment,
} from "../../services/redux-toolkit/reducers/discussionSlice";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import CommentSection from "./CommentSection";
import DropdownMenu from "./DropdownMenu";
import CommentInputBox from "./CommentInputBox";
import { setError } from "../../services/redux-toolkit/reducers/messageSlice";
import useWebSocket from "../../hooks/useWebSocket";

const Comment = ({ comment, onDeleteComment }) => {
  const { profile } = useSelector((state) => state.profile);
  const [id, setId] = useState(comment.id || "");
  const [text, setText] = useState(comment.text || "");
  const [ownerName, setOwnerName] = useState(comment.ownerName || "");
  const [ownerImageUrl, setOwnerImageUrl] = useState(
    comment.ownerImageUrl ||
      "https://res.cloudinary.com/du5medjhm/image/upload/v1730996001/avatar-40_d7hhex.png"
  );
  const [updatedAt, setUpdatedAt] = useState(comment.updatedAt || new Date());
  const [showReplies, setShowReplies] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);
  const [showOptions, setShowOptions] = useState(false);
  const { t } = useTranslation();
  const { error } = useSelector((state) => state.discussion);
  const dispatch = useDispatch();

  useEffect(() => {
    setId(comment.id);
    setText(comment.text);
    setOwnerName(comment.ownerName);
    setOwnerImageUrl(comment.ownerImageUrl);
    setUpdatedAt(comment.updatedAt);
  }, [comment]);

  const handleFetchReplies = async () => {
    try {
      const resultAction = await dispatch(getRepliesCommentById(id));
      if (getRepliesCommentById.fulfilled.match(resultAction)) {
        setReplies(resultAction.payload);
      } else {
        console.error(`Failed to fetch replies for comment ID ${id}: ${error}`);
      }
    } catch (e) {
      console.error(`Failed to fetch replies for comment ID ${id}: ${e}`);
    }
  };

  const handleShowReplies = async () => {
    await handleFetchReplies();
    setShowReplies((prev) => !prev);
  };

  // useEffect(() => {
  //   handleFetchReplies();
  // }, []);

  const handleReply = async (replyText) => {
    if (replyText.trim()) {
      try {
        const resultAction = await dispatch(
          replyComment({ commentId: id, text: replyText })
        );

        if (replyComment.rejected.match(resultAction)) {
          dispatch(
            setError(`${t("features.comment.replyComment.failure")} (${error})`)
          );
        } else {
          await handleFetchReplies();
        }
      } catch (e) {
        dispatch(
          setError(`${t("features.comment.replyComment.failure")} (${e})`)
        );
      }
    }
  };
  const handleEditComment = async (text) => {
    if (text.trim()) {
      try {
        const resultAction = await dispatch(updateComment({ id, text }));
        if (updateComment.fulfilled.match(resultAction)) {
          await setText(text);
          await setIsEditing((prev) => !prev);
        } else {
          dispatch(
            setError(`${t("features.discussion.editFailed")} (${error})`)
          );
        }
      } catch (e) {
        dispatch(setError(`${t("features.discussion.editFailed")} (${error})`));
      }
    }
  };

  const handleDeleteComment = async () => {
    onDeleteComment(id);
    await handleFetchReplies();
  };
  const onDeleteReply = async (commentId) => {
    try {
      const resultAction = await dispatch(deleteComment(commentId));
      if (deleteComment.fulfilled.match(resultAction)) {
        setReplies((prevReplies) =>
          prevReplies.filter((reply) => reply.id !== commentId)
        );
        alert("Comment deleted successfully");
      } else {
        alert(`Failed to delete comment: ${error}`);
      }
    } catch (e) {
      alert(`Failed to delete comment: ${e}`);
    }
  };

  return (
    <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <Image
            source={{ uri: ownerImageUrl || "" }}
            className="w-10 h-10 rounded-full mr-3"
          />
          <View>
            <Text className="font-bold text-gray-900">{ownerName}</Text>
            <Text className="text-xs text-gray-500">
              {new Date(updatedAt).toLocaleString()}
            </Text>
          </View>
        </View>

        {profile.fullName === ownerName && (
          <TouchableOpacity
            onPress={() => setShowOptions(!showOptions)}
            className="p-2"
          >
            <FontAwesome name="ellipsis-h" size={20} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>

      <View className="mb-3">
        {isEditing ? (
          <CommentInputBox onSubmit={handleEditComment} initialValue={text} />
        ) : (
          <Text className="text-gray-700 text-base leading-relaxed">
            {text}
          </Text>
        )}
      </View>

      <View className="flex-row items-center space-x-4">
        <TouchableOpacity
          onPress={handleShowReplies}
          className="flex-row items-center space-x-1"
        >
          <FontAwesome name="reply" size={14} color="#3b82f6" />
          <Text className="text-blue-500 font-medium">
            {t("features.discussion.reply")}
          </Text>
        </TouchableOpacity>
      </View>

      {showReplies && (
        <View className="mt-3 pl-4 border-l-2 border-gray-100">
          <CommentSection
            comments={replies}
            onAddComment={handleReply}
            onDeleteComment={onDeleteReply}
          />
        </View>
      )}

      {showOptions && (
        <View className="absolute right-2 top-12 z-10">
          <DropdownMenu
            onEdit={() => {
              setShowOptions((prev) => !prev);
              setIsEditing((prev) => !prev);
            }}
            onDelete={handleDeleteComment}
          />
        </View>
      )}
    </View>
  );
};

export default Comment;
