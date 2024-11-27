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
  toggleReaction,
} from "../../services/redux-toolkit/reducers/discussionSlice";
import { setError } from "../../services/redux-toolkit/reducers/messageSlice";
import CommentSection from "./CommentSection";
import DropdownMenu from "../../components/DiscussionPost/DropdownMenu";
import UpdateDiscussion from "../UpdateDiscussion";
import useWebSocket from "../../hooks/useWebSocket";

const DiscussionPost = ({ post }) => {
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
  const [description, setDescription] = useState(post.description);
  const [createdAt, setCreatedAt] = useState(post.createdAt);
  const [updatedAt, setUpdatedAt] = useState(post.updatedAt);
  const [endAt, setEndAt] = useState(post.endAt);
  const [imageUrls, setImageUrls] = useState(post.imageUrls);
  const [reactCount, setReactCount] = useState(post.reactCount);
  const [commentCount, setCommentCount] = useState(post.commentCount);
  const [ownerName, setOwnerName] = useState(post.ownerName);
  const [ownerImageUrl, setOwnerImageUrl] = useState(post.ownerImageUrl);
  const [liked, setLiked] = useState(post.liked);

  useEffect(() => {
    setId(post.id);
    setTitle(post.title);
    setDescription(post.description);
    setCreatedAt(post.createdAt);
    setUpdatedAt(post.updatedAt);
    setEndAt(post.endAt);
    setImageUrls(post.imageUrls);
    setReactCount(post.reactCount);
    setCommentCount(post.commentCount);
    setOwnerName(post.ownerName);
    setOwnerImageUrl(post.ownerImageUrl);
    setLiked(post.liked);
  }, [post]);

  // const stompClientRef = useWebSocket((message) => {
  //   console.log("Received message:", message);
  //   switch (message.type) {
  //     case "COMMENT":
  //       setComments((prevComments) => {
  //         if (!prevComments.some((comment) => comment.id === message.id)) {
  //           setCommentCount((prevCommentCount) => prevCommentCount + 1);

  //           return [message, ...prevComments];
  //         }
  //         return prevComments;
  //       });
  //       break;
  //     case "UPDATE":
  //       setComments((prevComments) => {
  //         const index = prevComments.findIndex(
  //           (comment) => comment.id === message.id
  //         );
  //         if (index !== -1) {
  //           const updatedComments = [...prevComments];
  //           updatedComments[index] = message;
  //           return updatedComments;
  //         }
  //         return prevComments;
  //       });
  //       break;
  //     default:
  //       break;
  //   }
  // }, `/topic/discuss/${post.id}`);

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

  const handleAddComment = async (text) => {
    if (text.trim()) {
      try {
        const resultAction = await dispatch(
          addComment({ discussId: id, text })
        );
        if (!addComment.fulfilled.match(resultAction)) {
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
  const handleEditDiscussion = async (discussion) => {
    try {
      const resultAction = await dispatch(updateDiscussion({ id, discussion }));
      if (updateDiscussion.fulfilled.match(resultAction)) {
        setTitle(discussion.title);
        setDescription(discussion.description);
        setEndAt(discussion.endAt);
        dispatch(setSuccess("Update Discussion is success!"));
      } else {
        dispatch(setError(`Edit Discussion Failed (${error})`));
      }
      setIsEditting(false);
    } catch (e) {
      dispatch(setError(`Edit Discussion Failed (${error})`));
    }
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
    } catch (e) {
      dispatch(setError(`Delete Discussion Failed! (${error})`));
    }
  };

  const onDeleteComment = async (commentId) => {
    try {
      const resultAction = await dispatch(deleteComment(commentId));
      if (deleteComment.fulfilled.match(resultAction)) {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
        setCommentCount((prevCount) => prevCount - 1);
        console.log("commentCount in Delete: ", commentCount);

        dispatch(setSuccess("Delete Comment Success!"));
      } else {
        dispatch(setError(`Delete Comment Failed! (${error})`));
      }
    } catch (e) {
      dispatch(setError(`Delete Comment Failed! (${e.message})`));
    }
  };
  useEffect(() => {
    fetchComments();
  }, [post]);

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

  return (
    <>
      {isEditing ? (
        <UpdateDiscussion
          post={post}
          onClose={() => setIsEditing((prev) => !prev)}
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
                : `${description.slice(0, 150)}...`}
            </Text>

            {description.length > 150 && (
              <TouchableOpacity 
                onPress={toggleDescription}
                className="mt-2"
              >
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

          <Text className={`mb-3 text-sm ${isLocked() ? 'text-red-500' : 'text-green-500'}`}>
            {lockMessage()}
          </Text>

          <View className="flex-row justify-between items-center border-t border-gray-100 pt-3">
            <TouchableOpacity
              onPress={() => dispatch(toggleReaction(id))}
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
