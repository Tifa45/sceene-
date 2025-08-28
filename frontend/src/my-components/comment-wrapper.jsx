import { useEffect, useState } from "react";
import CommentTile from "./comment-tile";
import axios from "axios";
import CommentForm from "./comment-form";
import { useUserStore } from "../stores/user-store";
import api from "../lib/axios-utils";

function CommentWrapper({
  parentComment,
  comment,
  setEditedComment,
  setDeletedComment,
  showId,
  replies,
  setReplies,
  setEditedReply,
  setDeletedReply,
  totalReplies,
  index,
}) {
  const userId = useUserStore((s) => s.userData.userId);

  const [addReply, setAddReply] = useState(false);
  const [viewAllReplies, setViewAllReplies] = useState(false);

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState(null);

  async function getCommentReplies() {
    const url = `/comments/show-comments?relatedShow=${showId}&parentComment=${comment._id}`;

    try {
      const response = await api.get(url);
      const { commentsData } = response.data;

      setReplies((prev) => [...prev, ...commentsData]);

      setErrMsg(null);
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response.data.message === "No Avaialble comments!"
      ) {
        setErrMsg(null);
      } else if (axios.isAxiosError(error)) {
        setErrMsg(error.response.data.message ?? error.message);
      } else {
        setErrMsg("Unexpected error");
        console.log(error.message);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    getCommentReplies();
  }, []);

  return (
    <div>
      <CommentTile
        key={comment._id}
        comment={comment}
        setEditedComment={setEditedComment}
        setDeletedComment={setDeletedComment}
        setReply={setAddReply}
      />
      <div className="mt-2 pl-2">
        {loading ? (
          <div className="w-full flex items-center justify-center">Loading</div>
        ) : errMsg ? (
          <div className="w-full flex items-center justify-center">
            {errMsg}
          </div>
        ) : (
          <>
            {addReply && (
              <CommentForm
                setAddComment={setAddReply}
                author={userId}
                relatedShow={showId}
                parentComment={parentComment}
                setRecentComments={setReplies}
                type={"reply"}
                index={index}
                replies={replies}
              />
            )}
            {!viewAllReplies && totalReplies > 0 ? (
              <button
                type="button"
                onClick={() => setViewAllReplies(true)}
                className="p-2"
              >
                show {totalReplies} replies
              </button>
            ) : (
              <div className="pl-4 border-l-2">
                {viewAllReplies &&
                  replies.map((reply, index) => (
                    <CommentWrapper
                      key={reply._id}
                      comment={reply}
                      setEditedComment={setEditedReply}
                      setDeletedComment={setDeletedReply}
                      showId={showId}
                      parentComment={parentComment}
                      replies={replies}
                      setReplies={setReplies}
                      index={index}
                    />
                  ))}
              </div>
            )}
            {viewAllReplies && (
              <button
                type="button"
                onClick={() => setViewAllReplies(false)}
                className="p-2"
              >
                hide replies
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CommentWrapper;
