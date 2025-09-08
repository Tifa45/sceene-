import { useEffect, useState } from "react";
import axios from "axios";
import { MessageCircleMore } from "lucide-react";
import CommentForm from "./comment-form";
import { useUserStore } from "../stores/user-store";
import { useParams } from "react-router-dom";

import CommentContainer from "./comment-container";
import { toast } from "sonner";
import api from "../lib/axios-utils";

function CommentSection() {
  const { id: currentShowId } = useParams();
  const userId = useUserStore((s) => s.userData.userId);

  const [showComments, setShowComments] = useState([]);
  const [recentComments, setRecentComments] = useState([]);
  const [editedComment, setEditedComment] = useState(null);
  const [deletedComment, setDeletedComment] = useState(null);

  const [addComment, setAddComment] = useState(false);

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState(null);

  const [loadMore, setLoadMore] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [page, setPage] = useState(0);
  const lastPage = page >= totalPages - 1;

  async function getShowComments(showId, changed) {
    const url = `/comments/show-comments?relatedShow=${showId}&page=${page}&recent=${recentComments.length}`;

    try {
      const response = await api.get(url);
      const { commentsData, totalPages, total } = response.data;

      const newCommentsIds = new Set(commentsData.map((c) => c._id));

      const filtered = changed
        ? []
        : showComments.filter((c) => !newCommentsIds.has(c._id));

      const updated = [...filtered, ...commentsData];

      setShowComments(updated);
      setTotalPages(totalPages);
      setTotalComments(total);

      setErrMsg(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrMsg(error.response.data.message ?? error.message);
      } else {
        setErrMsg("Unexpected error");
      }
    }
    setLoading(false);
    setLoadMore(false);
  }

  useEffect(() => {
    getShowComments(currentShowId, true);
  }, [currentShowId]);

  useEffect(() => {
    getShowComments(currentShowId);
  }, [page]);

  useEffect(() => {
    const showCommentsIds = new Set(showComments.map((c) => c._id));
    const filteredRecent = recentComments.filter(
      (c) => !showCommentsIds.has(c._id)
    );
    const updated = [...filteredRecent, ...showComments];
    setShowComments(updated);
  }, [addComment]);

  useEffect(() => {
    if (editedComment) {
      const updated = showComments.map((c) =>
        c._id === editedComment._id
          ? { ...c, content: editedComment.content }
          : c
      );
      setShowComments(updated);
    }
  }, [editedComment]);

  useEffect(() => {
    const filteredComments = showComments.filter(
      (c) => c._id !== deletedComment
    );
    const filteredRecentComments = recentComments.filter(
      (c) => c._id !== deletedComment
    );
    const updated = [...filteredRecentComments, ...filteredComments];
    setShowComments(updated);
  }, [deletedComment]);

  if (loading) return <div className="w-full p-8 ">Loading..</div>;
  return (
    <div className=" relative h-full min-h-20">
      <div className="flex flex-col fixed top-0 left-0 right-0 p-6 z-10 ">
        <div className="flex justify-between items-center  ">
          <h2 className="text-xl font-bold">
            <span className="text-2xl font-bold">{totalComments}</span> Comments
          </h2>
          <button
            onClick={() => {
              if (!userId) {
                toast.info("Login to add comments");
              } else {
                setAddComment(!addComment);
              }
            }}
            type="button"
            className="flex flex-col-reverse xl:flex-row items-center gap-2 2xl:gap-4 "
          >
            <MessageCircleMore size={35} />
          </button>
        </div>
        {addComment && (
          <CommentForm
            author={userId}
            relatedShow={currentShowId}
            setAddComment={setAddComment}
            setRecentComments={setRecentComments}
          />
        )}
      </div>

      {errMsg ? (
        <div className="w-full p-8 "> {errMsg} </div>
      ) : showComments.length === 0 ? (
        <div className="w-full h-full grid place-items-center mt-15  ">
          No Comments yet!
        </div>
      ) : (
        <div className="overflow-y-scroll mt-15 max-h-[30rem] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-500/50 [&::-webkit-scrollbar-thumb]:rounded-md ">
          {showComments.map((comment) => (
            <CommentContainer
              key={comment._id}
              comment={comment}
              setEditedComment={setEditedComment}
              setDeletedComment={setDeletedComment}
              showId={currentShowId}
              parentComment={comment._id}
            />
          ))}
          {loadMore ? (
            <p>loading...</p>
          ) : (
            !lastPage && (
              <div className=" w-full p-2 mt-2 ">
                <button
                  className=" w-full text-center font-light disabled:text-gray-400 disabled:cursor-default!"
                  type="button"
                  onClick={() => {
                    setPage((prev) => prev + 1);
                    setLoadMore(true);
                  }}
                >
                  Load more
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default CommentSection;
