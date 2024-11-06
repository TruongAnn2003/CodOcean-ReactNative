// import {
//   faHeart,
//   faMessage,
//   faEllipsisV,
// } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import {
//   Alert,
//   FlatList,
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Modal,
// } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import { setError } from "../../services/redux-toolkit/reducers/messageSlice";
// import {
//   addReactDiscussion,
//   deleteReactDiscussion,
//   getComments,
//   toggleReaction,
// } from "../../services/redux-toolkit/reducers/searchDiscussionSlice";
// import CommentsList from "../Comment/CommentsList";

// export function DiscussionPost({ discussion, onEdit }) {
//   const { t } = useTranslation();
//   const dispatch = useDispatch();
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [showComments, setShowComments] = useState(false);
//   const [showOptions, setShowOptions] = useState(false);

//   const { error } = useSelector((state) => state.searchDiscussion);
//   const {
//     title,
//     description,
//     createdAt,
//     reactCount,
//     image,
//     commentCount,
//     ownerName,
//     ownerImageUrl,
//     liked,
//   } = discussion;

//   const handleReactionToggle = async () => {
//     if (!liked) {
//       await handleAddReact();
//     } else {
//       await handleDeleteReact();
//     }
//     dispatch(toggleReaction(discussion.id));
//   };

//   const handleAddReact = async () => {
//     try {
//       const resultAction = await dispatch(addReactDiscussion(discussion.id));
//       if (addReactDiscussion.rejected.match(resultAction)) {
//         dispatch(
//           setError(
//             `${t("features.discussion.addReactDiscussion.failure")} (${error})`
//           )
//         );
//       }
//     } catch (e) {
//       dispatch(
//         setError(
//           `${t("features.discussion.addReactDiscussion.failure")} (${
//             e.message
//           })`
//         )
//       );
//     }
//   };

//   const handleDeleteReact = async () => {
//     try {
//       const resultAction = await dispatch(deleteReactDiscussion(discussion.id));
//       if (deleteReactDiscussion.rejected.match(resultAction)) {
//         dispatch(
//           setError(
//             `${t(
//               "features.discussion.deleteReactDiscussion.failure"
//             )} (${error})`
//           )
//         );
//       }
//     } catch (e) {
//       dispatch(
//         setError(
//           `${t("features.discussion.deleteReactDiscussion.failure")} (${
//             e.message
//           })`
//         )
//       );
//     }
//   };

//   const toggleComments = () => {
//     setShowComments(!showComments);
//   };

//   const toggleOptions = () => {
//     setShowOptions(!showOptions);
//   };

//   return (
//     <View style={styles.postContainer}>
//       {/* Header section */}
//       <View style={styles.postHeader}>
//         <Image
//           source={{ uri: ownerImageUrl }}
//           style={styles.ownerImage}
//           onError={() =>
//             Alert.alert("Image not found", "Default image will be used.")
//           }
//         />
//         <View style={styles.ownerInfo}>
//           <Text style={styles.ownerName}>{ownerName}</Text>
//           <Text style={styles.postDate}>
//             {new Date(createdAt).toLocaleString()}
//           </Text>
//         </View>
//         <TouchableOpacity onPress={toggleOptions} style={styles.optionsButton}>
//           <FontAwesomeIcon icon={faEllipsisV} size={20} color="#000" />
//         </TouchableOpacity>
//       </View>

//       {/* Options Dropdown */}
//       {showOptions && (
//         <Modal transparent={true} animationType="fade" visible={showOptions}>
//           <TouchableOpacity
//             style={styles.optionsOverlay}
//             onPress={() => setShowOptions(false)}
//           >
//             <View style={styles.optionsDropdown}>
//               <TouchableOpacity
//                 style={styles.optionItem}
//                 onPress={() => {
//                   setShowOptions(false);
//                   onEdit(discussion);
//                 }}
//               >
//                 <Text style={styles.optionText}>Edit</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.optionItem}
//                 onPress={() => {
//                   setShowOptions(false);
//                   // Implement your action for "Delete"
//                 }}
//               >
//                 <Text style={styles.optionText}>Delete</Text>
//               </TouchableOpacity>
//             </View>
//           </TouchableOpacity>
//         </Modal>
//       )}

//       {/* Main content */}
//       <View style={styles.postContent}>
//         <Text style={styles.postTitle}>{title}</Text>
//         <Text style={styles.postDescription}>
//           {isExpanded ? description : `${description.substring(0, 100)}... `}
//           <Text
//             onPress={() => setIsExpanded(!isExpanded)}
//             style={styles.readMore}
//           >
//             {isExpanded
//               ? t("features.discussion.readLess")
//               : t("features.discussion.readMore")}
//           </Text>
//         </Text>
//         {image && <Image source={{ uri: image }} style={styles.postImage} />}
//       </View>

//       {/* Footer section */}
//       <View style={styles.postFooter}>
//         <View style={styles.reactions}>
//           <TouchableOpacity
//             onPress={handleReactionToggle}
//             style={styles.reactionButton}
//           >
//             <FontAwesomeIcon
//               icon={faHeart}
//               size={20}
//               color={liked ? "#FF4081" : "#000"}
//             />
//             <Text style={[styles.reactText, liked && styles.liked]}>
//               {liked
//                 ? t("features.discussion.unlove")
//                 : t("features.discussion.love")}{" "}
//               {reactCount}
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.commentSection}
//             onPress={toggleComments}
//           >
//             <FontAwesomeIcon icon={faMessage} size={20} color="#000" />
//             <Text style={styles.commentText}>
//               {commentCount} {t("features.discussion.comment")}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//       {showComments && <CommentsList discussId={discussion.id} />}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   postContainer: {
//     borderWidth: 1,
//     borderColor: "#e0e0e0",
//     borderRadius: 10,
//     padding: 16,
//     backgroundColor: "#fff",
//     marginVertical: 10,
//     maxWidth: "100%",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   postHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   optionsButton: {
//     marginLeft: "auto",
//   },
//   optionsOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   optionsDropdown: {
//     width: 200,
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     padding: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   optionItem: {
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//   },
//   optionText: {
//     fontSize: 16,
//     color: "#333",
//   },
//   ownerImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 12,
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },
//   ownerInfo: {
//     flexDirection: "column",
//   },
//   ownerName: {
//     fontWeight: "bold",
//     fontSize: 16,
//     color: "#333",
//   },
//   postDate: {
//     fontSize: 12,
//     color: "#999",
//   },
//   postContent: {
//     marginTop: 12,
//   },
//   postTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 8,
//     color: "#333",
//   },
//   postDescription: {
//     fontSize: 14,
//     color: "#555",
//     marginBottom: 12,
//     lineHeight: 22,
//   },
//   postImage: {
//     width: "100%",
//     height: 200,
//     borderRadius: 8,
//     marginTop: 10,
//     resizeMode: "cover",
//   },
//   postFooter: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 12,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: "#eee",
//   },
//   reactions: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   reactionButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginRight: 20,
//   },
//   reactText: {
//     marginLeft: 6,
//     fontSize: 14,
//     color: "#333",
//   },
//   liked: {
//     color: "#FF4081",
//   },
//   commentSection: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   commentText: {
//     marginLeft: 6,
//     fontSize: 14,
//     color: "#333",
//   },
//   readMore: {
//     color: "#0088cc",
//     fontSize: 14,
//   },
// });

// export default DiscussionPost;

// // Example usage with DiscussDTO data
// const DiscussDTOExample = () => {
//   const post = {
//     id: "1",
//     title: "Improving Code Performance",
//     description:
//       "Let’s discuss various ways to optimize performance in React applications. This is a very important topic because web applications are becoming more complex, and performance is critical to user experience.",
//     createdAt: "2023-11-06T10:00:00Z",
//     updatedAt: "2023-11-06T12:00:00Z",
//     endAt: "2023-12-06T10:00:00Z", // Expire date
//     imageUrls: [
//       "https://images.unsplash.com/photo-1555066931-bf19f8fd1085",
//       "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
//       "https://images.unsplash.com/photo-1581291519195-ef11498d1cf9",
//     ],
//     commentCount: 12,
//     reactCount: 45,
//     ownerId: "123",
//     ownerName: "John Doe",
//     ownerImageUrl:
//       "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
//     isLiked: true,
//     categories: [
//       {
//         name: "Algorithms and Data Structures",
//         description:
//           "Aimed at building algorithmic thinking, this category includes exercises on sorting, searching, and data structures like stacks, queues, and binary trees.",
//       },
//       {
//         name: "Mathematical Problem Solving",
//         description:
//           "Ideal for those who want to develop mathematical reasoning through programming. These exercises require mathematical knowledge to solve issues such as optimization, calculations, and number theory.",
//       },
//       {
//         name: "Recursive Programming",
//         description:
//           "Focused on understanding and using recursion, a technique for solving complex problems by having functions call themselves, suited for divide-and-conquer problems.",
//       },
//     ],
//     comments: [
//       {
//         id: 1,
//         text: "Great discussion! I have been thinking about this topic too.",
//         updatedAt: "2023-11-06T11:00:00Z",
//         ownerId: "456",
//         ownerName: "Alice Smith",
//         ownerImageUrl:
//           "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
//         replies: [
//           {
//             id: 2,
//             text: "Yes, it is an important topic!",
//             updatedAt: "2023-11-06T11:30:00Z",
//             ownerId: "789",
//             ownerName: "Bob Brown",
//             ownerImageUrl:
//               "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
//           },
//         ],
//       },
//     ],
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <Post post={post} />
//     </div>
//   );
// };

export { default } from "./DiscussionPost";
