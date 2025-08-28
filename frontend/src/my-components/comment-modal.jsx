import axios from "axios";
import useClickOutSide from "../hooks/useClickOutSide";
import ConfirmTile from "./confirm-tile";
import api from "../lib/axios-utils";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { defaultProps, modalOutlayVars, modalTileVars } from "../lib/constans";

function CommentModal({
  setModalData,
  currentCommentId,
  selected,
  setSelected,
  setUpdates,
}) {
  async function deleteComment() {
    try {
      const request = api.delete("/comments/delete", {
        data: { commentId: currentCommentId ?? selected },
      });
      toast.promise(request, {
        loading: "Deleting",
        success: "Deleted succefully",
        error: (error) => error.response.data.message || error.message,
      });
      const response = await request;
      setSelected([]);
      handleCloseModal();
    } catch (error) {
      console.log(error);
    }
  }

  const handleCloseModal = () => {
    setModalData(false);
    setUpdates("idle");
  };

  const profileModalRef = useClickOutSide(handleCloseModal);
  return (
    <motion.div
      {...defaultProps}
      variants={modalOutlayVars}
      className="absolute inset-0 w-full h-[100vh] z-20 bg-black/25 grid place-items-center "
    >
      <motion.div
        variants={modalTileVars}
        ref={profileModalRef}
        className="w-[80%] max-w-5xl bg-primary  ring-4 rounded-lg flex flex-col items-center p-8 gap-12 relative"
      >
        <ConfirmTile
          handleCloseModal={handleCloseModal}
          action={deleteComment}
          title={
            selected && selected.length > 1
              ? `Confirm delete ${selected.length} comments`
              : "Confirm delete comment"
          }
          btnTxt="Delete"
        />
      </motion.div>
    </motion.div>
  );
}

export default CommentModal;
