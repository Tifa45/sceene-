import axios from "axios";
import useClickOutSide from "../hooks/useClickOutSide";
import EditShowForm from "./edit-show-form";
import RatingTile from "./rating-tile";
import ConfirmTile from "./confirm-tile";
import { useState } from "react";
import EidtBulkShowsForm from "./edit-bulk-shows-form";
import api from "../lib/axios-utils";
import { motion, AnimatePresence } from "framer-motion";
import { defaultProps, modalOutlayVars, modalTileVars } from "../lib/constans";
import { toast } from "sonner";

function ShowModal({
  modalType,
  setModalData,
  userRate,
  setCurrentUserRate,
  token,
  show,
  setScrollY,
  selected,
  setSelected,
  setUpdates,
}) {
  const [errMsg, setErrMsg] = useState(null);
  const modalRef = useClickOutSide(handleCloseModal);
  function handleCloseModal() {
    if (setScrollY) {
      setScrollY(true);
    }
    setModalData((data) => ({ ...data, isOpen: false, type: "" }));
    setUpdates("idle");
  }

  async function deleteImage(urlTodelete) {
    const splited = urlTodelete.split("/");
    const publicId = splited[splited.length - 1].split(".")[0];
    const folderName = splited[splited.length - 2];
    const path = folderName + "/" + publicId;

    try {
      await api.post("/shows/delete-img", { publicId: path });
      setErrMsg(null);
    } catch (error) {
      console.log(error);
      setErrMsg(error.response.data.message || error.message);
    }
  }
  async function handleDeleteShow() {
    deleteImage(show.image);
    try {
      await api.delete("/shows/delete", {
        data: { showToDelete: [show._id] },
      });
      toast.success("Deleted successfully");
      setErrMsg(null);
      handleCloseModal();
    } catch (error) {
      setErrMsg(error.response.data.message || error.message);
    }
  }

  async function handleDeleteManyShows() {
    const ids = selected.map((selectedShow) => selectedShow.id);
    const images = selected.map((selectedShow) => selectedShow.image);
    images.forEach((image) => deleteImage(image));
    try {
      await api.delete("/shows/delete", {
        data: { showToDelete: ids },
      });
      toast.success(`${selected.length} Shows deleted`);
      setErrMsg(null);
      setSelected([]);
      handleCloseModal();
    } catch (error) {
      console.log(error);
      setErrMsg(error.response.data.message || error.message);
    }
  }

  return (
    <motion.div
      {...defaultProps}
      variants={modalOutlayVars}
      className="absolute inset-0 w-full h-[100vh] z-40 bg-black/25 grid place-items-center "
    >
      <motion.div
        ref={modalRef}
        className="w-[80%] max-w-5xl bg-primary  ring-4 rounded-lg flex flex-col items-center p-8 gap-12 relative"
        variants={modalTileVars}
      >
        <div className="absolute top-0 right-0 p-8">
          <button type="button" onClick={handleCloseModal}>
            X
          </button>
        </div>
        {modalType === "rating" ? (
          <RatingTile
            showName={show.title}
            userRate={userRate}
            showId={show._id}
            setCurrentUserRate={setCurrentUserRate}
            handleCloseModal={handleCloseModal}
          />
        ) : modalType === "edit" ? (
          <EditShowForm show={show} handleCloseModal={handleCloseModal} />
        ) : modalType === "edit-many" ? (
          <EidtBulkShowsForm
            selected={selected}
            setSelected={setSelected}
            handleCloseModal={handleCloseModal}
          />
        ) : modalType === "delete" ? (
          <ConfirmTile
            handleCloseModal={handleCloseModal}
            action={handleDeleteShow}
            title={`Confirm delete "${show.title}"`}
            btnTxt="Delete"
          />
        ) : (
          <ConfirmTile
            handleCloseModal={handleCloseModal}
            action={handleDeleteManyShows}
            title={`Confirm delete ${selected.length} shows`}
            btnTxt="Delete"
          />
        )}
      </motion.div>
    </motion.div>
  );
}

export default ShowModal;
