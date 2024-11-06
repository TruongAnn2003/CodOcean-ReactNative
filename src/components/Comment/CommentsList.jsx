import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  LogBox,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  getComments,
  addComment,
} from "../../services/redux-toolkit/reducers/searchDiscussionSlice";
import { setError } from "../../services/redux-toolkit/reducers/messageSlice";
import { useTranslation } from "react-i18next";
import { Comment } from "./Comment";

export default function CommentsList({ discussId }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { error } = useSelector((state) => state.searchDiscussion);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const resultAction = await dispatch(getComments(discussId));
      if (getComments.fulfilled.match(resultAction)) {
        setComments([...resultAction.payload]);
      } else {
        dispatch(
          setError(`${t("features.discussion.getComments.failure")} (${error})`)
        );
      }
    } catch (e) {
      dispatch(
        setError(
          `${t("features.discussion.getComments.failure")} (${e.message})`
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [discussId]);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const resultAction = await dispatch(
          addComment({ discussId: discussId, text: newComment })
        );
        if (addComment.fulfilled.match(resultAction)) {
          setNewComment("");
          setComments((prev) => [...prev, resultAction.payload]);
        } else {
          dispatch(
            setError(
              `${t("features.discussion.addComment.failure")} (${error})`
            )
          );
        }
      } catch (e) {
        dispatch(
          setError(
            `${t("features.discussion.addComment.failure")} (${e.message})`
          )
        );
      }
    }
  };

  return (
    <View style={styles.commentsContainer}>
      {loading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <SafeAreaView style={{ flex: 1 }}>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <Comment comment={item} />}
            ListEmptyComponent={() => (
              <Text style={styles.noCommentsText}>
                {t("features.discussion.noComments")}
              </Text>
            )}
            nestedScrollEnabled // Enable nested scrolling here if needed
          />
        </SafeAreaView>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={"Comment.."}
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity onPress={handleAddComment} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>
            {t("features.discussion.send")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  commentsContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  noCommentsText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007bff",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
