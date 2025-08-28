import {  Trash2 } from "lucide-react";
import { useUserStore } from "../stores/user-store";
import axios from "axios";
import useClickOutSide from "../hooks/useClickOutSide";
import { useState } from "react";
import ConfirmTile from "./confirm-tile";
import CommentModal from "./comment-modal";
import { Link } from "react-router-dom";
import { formatUserFullName } from "../lib/utliles";



function PanelCommentTile({ comment, selected, setSelected, setUpdates }) {
  const token = JSON.parse(localStorage.getItem("token"));
  const [modalData, setModalData] = useState(false);
  function handleSelect(currentComment) {
    if (selected.includes(currentComment._id)) {
      const filtered = selected.filter(
        (selectedComment) => selectedComment !== currentComment._id
      );
      setSelected(filtered);
    } else {
      setSelected((selected) => [...selected, currentComment._id]);
    }
  }
  function handleModal(){
    setModalData(true);
    setUpdates("pending")
  }

  return (
    <div className="flex  items-center px-4 py-2 rounded-md border ">
      <div className="flex w-[20%] gap-2 items-center ">
        <div>
          <input
            type="checkbox"
            checked={selected.length > 0 && selected.includes(comment._id)}
            onChange={() => handleSelect(comment)}
            className="w-7 h-7 mr-2 border rounded-sm appearance-none accent-secondary checked:appearance-auto"
          />
        </div>
        <div className="py-4 flex-1 text-nowrap overflow-x-scroll [&::-webkit-scrollbar]:h-1  [&::-webkit-scrollbar-thumb]:bg-gray-500/50 [&::-webkit-scrollbar-thumb]:rounded-md transition-all ease-in-out duration-300">
          <Link
            to={`/profile/${comment.author._id}`}
            title={comment.author.fullName}
            target="blank"
          >
            {formatUserFullName(comment.author.fullName)}
          </Link>
        </div>
      </div>
      <div className="w-[20%] overflow-x-scroll [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-gray-500/50 [&::-webkit-scrollbar-thumb]:rounded-md">
        <Link
          to={`/shows/${comment.relatedShow?._id}`}
          title={comment.relatedShow?.title||"Show deleted"}
          target="blank"
        >
          {comment.relatedShow?.title?formatUserFullName(comment.relatedShow.title):"Show deleted"}
        </Link>
      </div>
      <div className="w-[20%]  overflow-x-scroll [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-gray-500/50 [&::-webkit-scrollbar-thumb]:rounded-md">
        <p > {comment.content} </p>
      </div>
      <div className="w-[20%] ">
          <p>{comment?.parentComment?"Reply":"Comment"}</p>
        </div>
      <div className="flex ml-auto">
        <button
          type="button"
          onClick={handleModal}
          className="bg-hover p-2 flex justify-center items-center rounded-md"
        >
          <Trash2 />
        </button>
      </div>
      {modalData && (
        <CommentModal
          token={token}
          setModalData={setModalData}
          currentCommentId={comment._id}
          setUpdates={setUpdates}
          setSelected={setSelected}
        />
      )}
    </div>
  );
}

export default PanelCommentTile;
