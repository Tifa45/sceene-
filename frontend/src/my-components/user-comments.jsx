import axios from "axios";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import PanelCommentTile from "./panel-comment-tile";
import CommentModal from "./comment-modal";
import { useUserStore } from "../stores/user-store";
import NoShowsFound from "./no-shows-found";
import Pagination from "./pagination";
import api from "../lib/axios-utils";
import { AnimatePresence } from "framer-motion";

function UserComments({ selectedUser }) {
  const tempToken = useUserStore((s) => s.tempToken);
  const [userComments, setUserComments] = useState([]);
  const [totalFound, setTotalFound] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [selected, setSelected] = useState([]);

  const [modalData, setModalData] = useState(false);
  const [updates, setUpdates] = useState("idle");

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState(null);

  function handleModal() {
    setModalData(true);
    setUpdates("pending");
  }
  function handleSelectAll() {
    const commentsIds = userComments.map((comment) => comment._id);
    if (selected.length !== commentsIds.length) {
      setSelected(commentsIds);
    } else setSelected([]);
  }

  function handleCurrentPage(page, prev, next) {
    if (page || page === 0) {
      setCurrentPage(page);
    }
    if (prev) {
      setCurrentPage((current) => current - 1);
    }
    if (next) {
      setCurrentPage((current) => current + 1);
    }
  }

  async function getUserComments(currentUser) {
    setLoading(true);

    try {
      const response = await api.get(
        `/comments/userComments?user=${currentUser}&page=${currentPage}`
      );
      const { total, totalPages, commentsData } = response.data;
      setUserComments(commentsData);
      setTotalPages(totalPages);
      setErrMsg(null);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        setErrMsg(error.response.data.message || error.message);
      } else {
        setErrMsg("Unexpected error!");
      }
    }

    setLoading(false);
  }

  useEffect(() => {
    // if (scrollY)
    if (updates === "idle") getUserComments(selectedUser);
  }, [currentPage, modalData, selectedUser, updates]);

  return (
    <div className="h-full overflow-hidden pb-50">
      <div className="flex items-center px-4 py-1 bg-secondary rounded-md  border mb-4 ">
        <div className="flex w-[20%] gap-6 items-center">
          <input
            type="checkbox"
            checked={
              selected.length > 0 && selected.length === userComments.length
            }
            onChange={handleSelectAll}
            className="w-7 h-7 border rounded-sm appearance-none accent-primary checked:appearance-auto"
          />
          <div className="py-4 flex-1 ">
            <p>Author</p>
          </div>
        </div>
        <div className="w-[20%] ">
          <p>Related Show</p>
        </div>
        <div className="w-[20%] ">
          <p>Content</p>
        </div>
        <div className="w-[20%] ">
          <p>Type</p>
        </div>
        <div className="flex ml-auto ">
          <button
            type="button"
            disabled={selected.length === 0}
            onClick={handleModal}
            className="bg-hover p-2 flex justify-center items-center rounded-md disabled:bg-gray-400/40 disabled:cursor-default!"
          >
            <Trash2 />
          </button>
        </div>
      </div>
      <div className="space-y-4 h-full overflow-y-scroll [&::-webkit-scrollbar]:w-2  [&::-webkit-scrollbar-thumb]:bg-gray-500/50 [&::-webkit-scrollbar-thumb]:rounded-md">
        {loading ? (
          <NoShowsFound msg="Loading..." />
        ) : errMsg ? (
          <NoShowsFound msg={errMsg} />
        ) : userComments && userComments.length > 0 ? (
          <>
            {userComments.map((comment) => (
              <PanelCommentTile
                key={comment._id}
                comment={comment}
                selected={selected}
                setSelected={setSelected}
                setUpdates={setUpdates}
              />
            ))}
          </>
        ) : (
          <NoShowsFound msg="No shows found..." />
        )}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          handlePage={handleCurrentPage}
          shift={3}
          pagesCount={6}
          totalPages={totalPages}
        />
      )}
      <AnimatePresence>
        {modalData && (
          <CommentModal
            token={tempToken}
            setModalData={setModalData}
            selected={selected}
            setUpdates={setUpdates}
            setSelected={setSelected}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserComments;
