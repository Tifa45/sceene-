import { ThumbsUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CommentOptions from "./comment-options";
import CommentForm from "./comment-form";
import ConfirmDeleteComment from "./confirm-delete-comment";
import axios from "axios";
import { useUserStore } from "../stores/user-store";
import { Link } from "react-router-dom";
import api from "../lib/axios-utils";
import { toast } from "sonner";

function CommentTile({
  comment,
  setEditedComment,
  setDeletedComment,
  setReply,
}) {
  const userId = useUserStore((s) => s.userData.userId);
  const user = userId === comment.author?._id || false;
  const [expand, setExpand] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const content = useRef(null);

  const [edit, setEdit] = useState(false);
  const [deleteComment, setDeleteComment] = useState(false);

  const [isLiked, setIsLiked] = useState(() => comment.likes.includes(userId));
  const [disapled, setDisapled] = useState(false);

  async function handleDeleteComment() {
    try {
      const request = api.delete("/comments/delete", {
        data: { commentId: comment._id },
      });
      toast.promise(request, {
        loading: "Deleting",
        success: "Comment deleted",
        error: (error) => error.response.data.message || error.message,
      });
      const resposne = await request;
      setDeletedComment(comment._id);
    } catch (error) {
      console.log(error.response.data.message || error.message);
    }
  }

  async function handleLike() {
    setDisapled(true);
    try {
      const request = api.patch("/comments/likes", {
        commentId: comment._id,
      });
      toast.promise(request, {
        loading: "Loading...",
        success: (data) => {
          const state = data.data.isLiked ? "Liked" : "Unliked";
          return state;
        },
        error: (error) => error.response.data.message || error.message,
      });
      const response = await request;
      setIsLiked(response.data.isLiked);
    } catch (error) {
      console.log(error.response.data.message || error.message);
    }
    setDisapled(false);
  }

  useEffect(() => {
    const comment = content.current;

    const observer = new ResizeObserver(() => {
      if (comment.scrollHeight > comment.clientHeight && !expand) {
        setShowMore(true);
      } else setShowMore(false);
    });
    observer.observe(comment);
    return () => observer.disconnect();
  }, [expand]);

  return (
    <div className="w-full flex flex-col pt-8 pb-4 border-t ">
      <div className={` bg-primary rounded-lg p-6 shadow-sm shadow-blue-400 `}>
        <div className="flex justify-between mb-4">
          <Link
            to={`/profile/${comment.author?._id || 0}`}
            title="View profile"
          >
            <h3 className="text-xl font-semibold">
              {comment.author?.fullName || "Unknown User"}
            </h3>
          </Link>

          {user && <CommentOptions func1={setEdit} func2={setDeleteComment} />}
        </div>
        {edit ? (
          <CommentForm
            type={"edit"}
            setEdit={setEdit}
            commentId={comment._id}
            currentContent={comment.content}
            setEditedComment={setEditedComment}
          />
        ) : deleteComment ? (
          <ConfirmDeleteComment
            switchState={setDeleteComment}
            action={handleDeleteComment}
          />
        ) : (
          <div
            ref={content}
            onClick={() => setExpand(!expand)}
            className={` ${
              expand ? "max-h-auto" : "max-h-[3rem]"
            } overflow-hidden relative cursor-pointer  `}
          >
            <p className="text-base font-light ">{comment.content}</p>
            {showMore && (
              <button
                type="button"
                onClick={() => setExpand(true)}
                className="absolute bottom-0 right-0 bg-primary text-white/50 px-[2px]  "
              >
                ...see more
              </button>
            )}
          </div>
        )}
      </div>
      <div className="flex gap-4 items-center ml-8 mt-4  ">
        <button
          type="button"
          onClick={() => {
            if (!userId) {
              toast.info("Login to reply to comments");
            } else {
              setReply(true);
            }
          }}
          className="flex items-center hover:text-white"
        >
          Reply
        </button>
        <button
          disabled={disapled}
          type="button"
          onClick={() => {
            if (!userId) {
              toast.info("Login to like comments");
            } else {
              handleLike();
            }
          }}
          className="flex items-center gap-2 hover:text-white disabled:text-gray-300 disabled:cursor-default!"
        >
          <p> {isLiked ? "Liked" : "Like"} </p>
          <ThumbsUp size={18} className={`${isLiked && "fill-blue-500"}`} />
        </button>
      </div>
    </div>
  );
}

export default CommentTile;
