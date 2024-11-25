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

  const fetchComments = async () => {
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
  };

  const handleAddComment = async (text) => {
    if (text.trim()) {
      try {
        const resultAction = await dispatch(
          addComment({ discussId: id, text })
        );
        if (addComment.fulfilled.match(resultAction)) {
          setComments((prev) => [...prev, resultAction.payload]);
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
  const handleDeleteDiscussion = async () => {
    setShowOptions((prev) => !prev);
    try {
      const resultAction = await dispatch(deleteDiscussion(id));
      if (deleteDiscussion.fulfilled.match(resultAction)) {
        dispatch(setSuccess(`Delete Discussion Success!`));
      } else {
        dispatch(setError(`Delete Discussion Failed! (${error})`));
      }
    } catch (e) {
      dispatch(setError(`Delete Discussion Failed! (${error})`));
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
        <View style={styles.container}>
          <View style={styles.header}>
            <Image source={{ uri: ownerImageUrl }} style={styles.avatar} />
            <View style={styles.headerText}>
              <Text style={styles.ownerName}>{ownerName}</Text>
              <Text style={styles.createdAt}>
                {new Date(createdAt).toLocaleString()}
              </Text>
            </View>
            {profile.fullName === ownerName && (
              <TouchableOpacity onPress={() => setShowOptions(!showOptions)}>
                <FontAwesome name="ellipsis-h" size={20} color="#6b7280" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              {showFullDescription
                ? description
                : `${description.slice(0, 150)}...`}
            </Text>

            {description.length > 150 && (
              <TouchableOpacity onPress={toggleDescription}>
                <Text style={styles.toggleText}>
                  {showFullDescription ? "Show less" : "Show more"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {imageUrls.length > 0 && (
            <View style={styles.imageContainer}>
              {imageUrls.slice(0, 2).map((url, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => openImageModal(url)}
                >
                  <Image source={{ uri: url }} style={styles.imageThumbnail} />
                </TouchableOpacity>
              ))}
              {imageUrls.length > 2 && (
                <TouchableOpacity onPress={() => openImageModal(imageUrls[2])}>
                  <Text style={styles.showMoreText}>...</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <Text
            style={
              isLocked() ? styles.lockMessageOpen : styles.lockMessageClosed
            }
          >
            {lockMessage()}
          </Text>

          <View style={styles.footer}>
            <TouchableOpacity
              onPress={() => dispatch(toggleReaction(id))}
              style={styles.reactionButton}
            >
              <FontAwesome
                name="heart"
                size={20}
                color={liked ? "red" : "gray"}
              />
              <Text style={styles.reactionCount}>{reactCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowComments(!showComments)}
              style={styles.reactionButton}
            >
              <FontAwesome name="comment" size={20} color="gray" />
              <Text style={styles.reactionCount}>{commentCount}</Text>
            </TouchableOpacity>
          </View>

          {showOptions && (
            <View style={styles.optionsContainer}>
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
            animationType="slide"
            onRequestClose={closeImageModal}
          >
            <View style={styles.modalContainer}>
              <Image source={{ uri: selectedImage }} style={styles.fullImage} />
              <TouchableOpacity
                style={styles.closeButton}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  createdAt: {
    fontSize: 12,
    color: "#6b7280",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  descriptionContainer: {
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#4b5563",
  },
  toggleText: {
    fontSize: 14,
    color: "#1d4ed8",
    marginTop: 5,
  },
  imageContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  imageThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  showMoreText: {
    fontSize: 14,
    color: "#1d4ed8",
  },
  lockMessageOpen: {
    color: "red",
    fontSize: 14,
    marginBottom: 8,
  },
  lockMessageClosed: {
    color: "green",
    fontSize: 14,
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  reactionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  reactionCount: {
    marginLeft: 8,
    fontSize: 14,
    color: "#4b5563",
  },
  optionsContainer: {
    position: "absolute",
    right: 10,
    top: 40,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  fullImage: {
    width: "90%",
    height: "80%",
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
});
export default DiscussionPost;
