import React, { memo, useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const CommentInputBox = ({ onSubmit, initialValue = "" }) => {
  const [comment, setComment] = useState(initialValue);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      setError("Comment cannot be empty");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(comment);
      setComment("");
      setError(""); // Clear error on successful submission
    } catch (err) {
      setError("Failed to submit comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.textInput}
        value={comment}
        onChangeText={(text) => setComment(text)}
        placeholder="Write your comment..."
        multiline
      />
      <TouchableOpacity
        onPress={handleSubmit}
        style={[styles.sendButton, isSubmitting && { opacity: 0.5 }]} // Disable button while submitting
        disabled={isSubmitting}
      >
        <FontAwesome name="send" size={20} color="#fff" />
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  textInput: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
  },
  sendButton: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});

export default memo(CommentInputBox);
