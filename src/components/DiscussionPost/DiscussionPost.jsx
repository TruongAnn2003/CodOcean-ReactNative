import React, { useCallback, useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  addComment,
  getComments,
  addReactDiscussion,
  deleteReactDiscussion,
  deleteDiscussion,
  deleteComment,
} from "../../services/redux-toolkit/reducers/discussionSlice";
import { setError } from "../../services/redux-toolkit/reducers/messageSlice";
import CommentSection from "./CommentSection";
import DropdownMenu from "../../components/DiscussionPost/DropdownMenu";
import UpdateDiscussion from "../UpdateDiscussion";
import useWebSocket from "../../hooks/useWebSocket";
import { setSuccess } from "../../services/redux-toolkit/reducers/messageSlice";

const DiscussionPost = ({ post, onUpdate, onDelete, onToggleReaction }) => {
  const { error } = useSelector((state) => state.discussion);
  const [comments, setComments] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const { profile } = useSelector((state) => state.profile);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState(post.id);
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description || "");
  const [createdAt, setCreatedAt] = useState(post.createdAt);
  const [updatedAt, setUpdatedAt] = useState(post.updatedAt);
  const [endAt, setEndAt] = useState(post.endAt);
  const [imageUrls, setImageUrls] = useState(post.imageUrls || []);
  const [reactCount, setReactCount] = useState(post.reactCount);
  const [commentCount, setCommentCount] = useState(post.commentCount);
  const [ownerName, setOwnerName] = useState(post.ownerName);
  const [ownerImageUrl, setOwnerImageUrl] = useState(post.ownerImageUrl);
  const [liked, setLiked] = useState(post.liked);
  const [stompClientRef, setStompClientRef] = useState(null);

  useWebSocket((message) => {
    console.log("Received message:", message);
    switch (message.type) {
      case "COMMENT":
        setComments((prevComments) => {
          if (!prevComments.some((comment) => comment.id === message.id)) {
            setCommentCount((prevCommentCount) => prevCommentCount + 1);
            return [message, ...prevComments];
          }
          return prevComments;
        });
        break;
      case "UPDATE":
        setComments((prevComments) => {
          const index = prevComments.findIndex(
            (comment) => comment.id === message.id
          );
          if (index !== -1) {
            const updatedComments = [...prevComments];
            updatedComments[index] = message;
            return updatedComments;
          }
          return prevComments;
        });
        break;
      default:
        break;
    }
  }, `/topic/discuss/${post.id}`);

  useEffect(() => {
    setId(post.id);
    setTitle(post.title);
    setDescription(post.description || "");
    setCreatedAt(post.createdAt);
    setUpdatedAt(post.updatedAt);
    setEndAt(post.endAt);
    setImageUrls(post.imageUrls || []);
    setReactCount(post.reactCount);
    setCommentCount(post.commentCount);
    setOwnerName(post.ownerName);
    setOwnerImageUrl(post.ownerImageUrl);
    setLiked(post.liked);
  }, [post]);

  const handleEditDiscussion = async (discussion) => {
    try {
      setTitle(discussion.title);
      setDescription(discussion.description);
      setEndAt(discussion.endAt);
      setReactCount(discussion.reactCount);
      setCommentCount(discussion.commentCount);
      setOwnerName(discussion.ownerName);
      setOwnerImageUrl(discussion.ownerImageUrl);
      setLiked(discussion.liked);

      onUpdate(discussion);

      dispatch(setSuccess("Update Discussion is success!"));
    } catch (e) {}
  };

  const handleDeleteDiscussion = async () => {
    try {
      const resultAction = await dispatch(deleteDiscussion(id));
      if (deleteDiscussion.fulfilled.match(resultAction)) {
        onDelete(post);
        dispatch(setSuccess(`Delete Discussion Success!`));
      } else {
        dispatch(setError(`Delete Discussion Failed! (${error})`));
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (showComments) {
      fetchComments();
    } else {
      setComments([]);
    }
  }, [post, showComments]);

  const fetchComments = useCallback(async () => {
    try {
      const resultAction = await dispatch(getComments(id));
      if (getComments.fulfilled.match(resultAction)) {
        setComments(resultAction.payload);
      } else {
        dispatch(
          setError(`${t("features.comment.getComments.failure")} (${error})`)
        );
      }
    } catch (e) {
      dispatch(
        setError(`${t("features.comment.getComments.failure")} (${e.message})`)
      );
    }
  }, []);

  const onDeleteComment = async (commentId) => {
    try {
      const resultAction = await dispatch(deleteComment(commentId));
      if (deleteComment.fulfilled.match(resultAction)) {
        fetchComments();
        dispatch(setSuccess("Delete Comment Success!"));
      } else {
        dispatch(setError(`Delete Comment Failed! (${error})`));
      }
    } catch (e) {
      dispatch(setError(`Delete Comment Failed! (${e.message})`));
    }
  };

  const handleAddComment = async (text) => {
    if (text.trim()) {
      try {
        const resultAction = await dispatch(
          addComment({ discussId: id, text })
        );
        if (addComment.fulfilled.match(resultAction)) {
          fetchComments();
        } else {
          dispatch(
            setError(`${t("features.comment.addComment.failure")} (${error})`)
          );
        }
      } catch (e) {
        dispatch(
          setError(`${t("features.comment.addComment.failure")} (${e.message})`)
        );
      }
    }
  };

  const toggleDescription = () => setShowFullDescription(!showFullDescription);

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const lockMessage = () => {
    const now = new Date();
    const endAtDate = new Date(endAt);
    if (endAtDate < now) {
      return "Bài viết đã bị khóa";
    }
    const timeLeft = Math.ceil((endAtDate - now) / (1000 * 60 * 60 * 24));
    return `Bài viết sẽ bị khóa trong ${timeLeft} ngày`;
  };

  const isLocked = () => {
    const now = new Date();
    const endAtDate = new Date(endAt);
    return endAtDate < now;
  };

  const handleReactionToggle = async () => {
    if (!liked) {
      await handleAddReact();
    } else {
      await handleDeleteReact();
    }
    onToggleReaction(id);
  };

  const handleAddReact = async () => {
    try {
      const resultAction = await dispatch(addReactDiscussion(id));
      if (addReactDiscussion.rejected.match(resultAction)) {
        dispatch(
          setError(
            `${t("features.discussion.addReactDiscussion.failure")} (${error})`
          )
        );
      }
    } catch (e) {
      dispatch(
        setError(
          `${t("features.discussion.addReactDiscussion.failure")} (${
            e.message
          })`
        )
      );
    }
  };

  const handleDeleteReact = async () => {
    try {
      const resultAction = await dispatch(deleteReactDiscussion(id));
      if (deleteReactDiscussion.rejected.match(resultAction)) {
        dispatch(
          setError(
            `${t(
              "features.discussion.deleteReactDiscussion.failure"
            )} (${error})`
          )
        );
      }
    } catch (e) {
      dispatch(
        setError(
          `${t("features.discussion.deleteReactDiscussion.failure")} (${
            e.message
          })`
        )
      );
    }
  };

  return (
    <>
      {isEditing ? (
        <UpdateDiscussion
          post={post}
          onClose={() => setIsEditing((prev) => !prev)}
          onEditDiscussion={handleEditDiscussion}
        />
      ) : (
        <View className="bg-white rounded-xl p-4 mb-4 shadow-md">
          <View className="flex-row items-center mb-3">
            <Image
              source={{ uri: ownerImageUrl }}
              className="w-10 h-10 rounded-full mr-3"
            />
            <View className="flex-1">
              <Text className="font-bold text-gray-900">{ownerName}</Text>
              <Text className="text-xs text-gray-500">
                {new Date(createdAt).toLocaleString()}
              </Text>
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

          <Text className="text-lg font-bold text-gray-900 mb-2">{title}</Text>

          <View className="mb-3">
            <Text className="text-gray-700 leading-relaxed">
              {showFullDescription
                ? description
                : `${description ? description.slice(0, 150) : ""}...`}
            </Text>

            {description && description.length > 150 && (
              <TouchableOpacity onPress={toggleDescription} className="mt-2">
                <Text className="text-blue-600 font-medium">
                  {showFullDescription ? "Show less" : "Show more"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {imageUrls.length > 0 && (
            <View className="flex-row flex-wrap mb-3 -mx-1">
              {imageUrls.slice(0, 2).map((url, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => openImageModal(url)}
                  className="w-1/2 p-1"
                >
                  <Image
                    source={{ uri: url }}
                    className="w-full h-32 rounded-lg"
                  />
                </TouchableOpacity>
              ))}
              {imageUrls.length > 2 && (
                <TouchableOpacity
                  onPress={() => openImageModal(imageUrls[2])}
                  className="w-1/2 p-1 items-center justify-center bg-gray-100 rounded-lg h-32"
                >
                  <Text className="text-lg text-gray-600 font-bold">
                    +{imageUrls.length - 2}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <Text
            className={`mb-3 text-sm ${
              isLocked() ? "text-red-500" : "text-green-500"
            }`}
          >
            {lockMessage()}
          </Text>

          <View className="flex-row justify-between items-center border-t border-gray-100 pt-3">
            <TouchableOpacity
              onPress={handleReactionToggle}
              className="flex-row items-center"
            >
              <FontAwesome
                name="heart"
                size={20}
                color={liked ? "#ef4444" : "#9ca3af"}
              />
              <Text className="ml-2 text-gray-600">{reactCount}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowComments(!showComments)}
              className="flex-row items-center"
            >
              <FontAwesome name="comment" size={20} color="#9ca3af" />
              <Text className="ml-2 text-gray-600">{commentCount}</Text>
            </TouchableOpacity>
          </View>

          {showOptions && (
            <View className="absolute right-4 top-12 bg-white rounded-lg shadow-xl py-2 z-10">
              <DropdownMenu
                onEdit={() => {
                  setShowOptions((prev) => !prev);
                  setIsEditing((prev) => !prev);
                }}
                onDelete={handleDeleteDiscussion}
              />
            </View>
          )}

          {showComments && (
            <CommentSection
              comments={comments}
              onAddComment={handleAddComment}
              onDeleteComment={onDeleteComment}
            />
          )}

          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={closeImageModal}
          >
            <View className="flex-1 bg-black/90 justify-center items-center">
              <Image
                source={{ uri: selectedImage }}
                className="w-full h-4/5"
                resizeMode="contain"
              />
              <TouchableOpacity
                className="absolute top-10 right-6 p-2"
                onPress={closeImageModal}
              >
                <FontAwesome name="times" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      )}
    </>
  );
};

export default DiscussionPost;
