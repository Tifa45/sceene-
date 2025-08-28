import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import ShowModal from "./show-modal";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

function PanelShowTile({
  show,
  setScrollY,
  selected,
  setSelected,
  setUpdates,
}) {
  const token = JSON.parse(localStorage.getItem("token"));
  const [modalData, setModalData] = useState({ isOpen: false, type: "" });

  function handleSelect(currentShow) {
    if (
      selected.find((selectedShows) => selectedShows.id === currentShow._id)
    ) {
      const filtered = selected.filter(
        (selectedShow) => selectedShow.id !== currentShow._id
      );
      setSelected(filtered);
    } else {
      setSelected((selected) => [
        ...selected,
        { id: currentShow._id, image: currentShow.image },
      ]);
    }
  }

  function handleModal(state, type) {
    setModalData((prev) => ({ ...prev, isOpen: state, type: type ?? "" }));
    setUpdates("pending");
  }

  return (
    <div className="flex  items-center px-4 py-2  rounded-md justify-between border ">
      <div className="flex w-[25%] gap-2 items-center">
        <div>
          <input
            type="checkbox"
            checked={
              selected.length > 0 &&
              selected.find((selectedShows) => selectedShows.id === show._id)
            }
            onChange={() => handleSelect(show)}
            className="w-7 h-7 mr-2 border rounded-sm appearance-none accent-secondary checked:appearance-auto"
          />
        </div>
        <div className="w-15 h-15 border rounded-md overflow-hidden">
          <img
            src={show.image}
            alt={show.title}
            className="aspect-square w-fit object-cover"
          />
        </div>
        <div className="py-4 flex-1 text-nowrap overflow-x-scroll [&::-webkit-scrollbar]:h-1  [&::-webkit-scrollbar-thumb]:bg-gray-500/50 [&::-webkit-scrollbar-thumb]:rounded-md transition-all ease-in-out duration-300">
          <Link to={`/shows/${show._id}`} title={show.title}>
            {show.title}
          </Link>
        </div>
      </div>
      <div className="w-[20%] overflow-x-scroll [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-gray-500/50 [&::-webkit-scrollbar-thumb]:rounded-md">
        <Link to={`/profile/${show.uploadedBy._id}`}>
          {show.uploadedBy.fullName}
        </Link>
      </div>
      <div className="w-[20%] overflow-x-scroll [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-gray-500/50 [&::-webkit-scrollbar-thumb]:rounded-md">
        <Link to={`/profile/${show.uploadedBy._id}`}>
          {show.uploadedBy.email}
        </Link>
      </div>
      <div className="flex gap-2 ">
        <button
          type="button"
          onClick={() => handleModal(true, "edit")}
          className="bg-primary p-2 flex justify-center items-center rounded-md"
        >
          <Pencil />
        </button>
        <button
          type="button"
          onClick={() => handleModal(true, "delete")}
          className="bg-hover p-2 flex justify-center items-center rounded-md"
        >
          <Trash2 />
        </button>
      </div>
      <AnimatePresence>
        {modalData.isOpen && (
          <ShowModal
            key={show._id}
            modalType={modalData.type}
            setModalData={setModalData}
            show={show}
            showId={show._id}
            showName={show.title}
            token={token}
            setUpdates={setUpdates}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default PanelShowTile;
