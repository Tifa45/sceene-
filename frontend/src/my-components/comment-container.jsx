import { useEffect, useState } from "react";
import { useUserStore } from "../stores/user-store";
import axios from "axios";
import CommentWrapper from "./comment-wrapper";

function CommentContainer({
  parentComment,
  comment,
  setEditedComment,
  setDeletedComment,
  showId,
}) {
  const [replies, setReplies] = useState([]);
  const [editedReply, setEditedReply] = useState();
  const [deletedReply, setDeletedReply] = useState();
  const totalReplies = replies.length;



  useEffect(() => {
    if (editedReply) {
      const updated = replies.map((c) =>
        c._id === editedReply._id ? { ...c, content: editedReply.content } : c
      );
      setReplies(updated);
    }
  }, [editedReply]);

  useEffect(() => {
    const filteredReplies = replies.filter((c) => c._id !== deletedReply);
    const updated = [...filteredReplies];
    setReplies(updated);
  }, [deletedReply]);

  return (
    <CommentWrapper
      parentComment={parentComment}
      comment={comment}
      setEditedComment={setEditedComment}
      setDeletedComment={setDeletedComment}
      showId={showId}
      replies={replies}
      setReplies={setReplies}
      setEditedReply={setEditedReply}
      setDeletedReply={setDeletedReply}
      totalReplies={totalReplies}
      index={-1}
    />
  );
}

export default CommentContainer;
