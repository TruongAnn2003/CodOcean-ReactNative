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

const Comment = ({ comment }) => {
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
        setReplies([...resultAction.payload]);
      } else {
        dispatch(
          setError(
            `${t(
              "features.discussion.getReplysCommentById.failure"
            )} (${error})`
          )
        );
      }
    } catch (e) {
      dispatch(
        setError(
          `${t("features.discussion.getReplysCommentById.failure")} (${e})`
        )
      );
    }
  };

  useEffect(() => {
    handleFetchReplies();
  }, []);

  const handleReply = async (replyText) => {
    if (replyText.trim()) {
      try {
        const resultAction = await dispatch(
          replyComment({ commentId: id, text: replyText })
        );
        if (replyComment.fulfilled.match(resultAction)) {
          setReplies((prev) => [...prev, resultAction.payload]);
        } else {
          dispatch(
            setError(`${t("features.discussion.replyFailed")} (${error})`)
          );
        }
      } catch (e) {
        dispatch(
          setError(`${t("features.discussion.replyFailed")} (${error})`)
        );
      }
    }
  };

  const handleEditComment = async (text) => {
    if (text.trim()) {
      try {
        const resultAction = await dispatch(updateComment({ id, text }));
        if (updateComment.fulfilled.match(resultAction)) {
          setText(text);
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
    await setShowOptions(!showOptions);
    try {
      const resultAction = await dispatch(deleteComment(id));
      if (deleteComment.fulfilled.match(resultAction)) {
        await dispatch(setSuccess(`${t("features.discussion.deleteSuccess")}`));
      } else {
        dispatch(
          setError(`${t("features.discussion.deleteFailed")} (${error})`)
        );
      }
    } catch (e) {
      dispatch(setError(`${t("features.discussion.deleteFailed")} (${error})`));
    }
  };

  return (
    <View style={styles.commentContainer}>
      <View style={styles.header}>
        <Image source={{ uri: ownerImageUrl || "" }} style={styles.avatar} />
        <View style={styles.headerContent}>
          <Text style={styles.ownerName}>{ownerName}</Text>
          <Text style={styles.updatedAt}>
            {new Date(updatedAt).toLocaleString()}
          </Text>
        </View>
        {profile.fullName === ownerName && (
          <TouchableOpacity onPress={() => setShowOptions(!showOptions)}>
            <FontAwesome name="ellipsis-h" size={20} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.commentContent}>
        {isEditing ? (
          <CommentInputBox onSubmit={handleEditComment} initialValue={text} />
        ) : (
          <Text style={styles.commentText}>{text}</Text>
        )}
      </View>
      <TouchableOpacity
        onPress={() => setShowReplies((prev) => !prev)}
        style={styles.replyButton}
      >
        <Text style={styles.replyText}>{t("features.discussion.reply")}</Text>
      </TouchableOpacity>
      {showReplies && (
        <View style={styles.repliesContainer}>
          <CommentSection comments={replies} onAddComment={handleReply} />
        </View>
      )}

      {showOptions && (
        <View style={styles.optionsContainer}>
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
const styles = StyleSheet.create({
  commentContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  ownerName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  updatedAt: {
    color: "#6b7280",
    fontSize: 14,
  },
  optionsContainer: {
    position: "absolute",
    right: 0,
    top: 40,
  },
  commentContent: {
    marginBottom: 12,
  },
  commentText: {
    fontSize: 16,
    color: "#333",
  },
  replyButton: {
    alignSelf: "flex-start",
  },
  replyText: {
    color: "#3b82f6",
    fontSize: 14,
  },
  repliesContainer: {
    marginLeft: 32,
  },
});
export default Comment;
