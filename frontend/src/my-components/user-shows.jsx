import { useEffect, useState } from "react";
import { useUserStore } from "../stores/user-store";
import PanelShowTile from "./panel-show-tile";
import axios from "axios";
import NoShowsFound from "./no-shows-found";
import Pagination from "./pagination";
import { Pencil, Trash2 } from "lucide-react";
import ShowModal from "./show-modal";
import { AnimatePresence } from "framer-motion";
import api from "../lib/axios-utils";

function UserShows({ setScrollY, scrollY, selectedUser }) {
  const { userId } = useUserStore((s) => s.userData);
  const tempToken = useUserStore((s) => s.tempToken);
  const [userShows, setUserShows] = useState([]);
  const [totalFound, setTotalFound] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [selected, setSelected] = useState([]);

  const [modalData, setModalData] = useState({ isOpen: false, type: "" });
  const [updates, setUpdates] = useState("idle");

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState(null);

  function handleSelectAll() {
    const showsData = userShows.map((show) => ({
      id: show._id,
      image: show.image,
    }));
    if (selected.length !== showsData.length) {
      setSelected(showsData);
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

  function handleModal(state, type) {
    setModalData((prev) => ({ ...prev, isOpen: state, type: type ?? "" }));
    setUpdates("pending");
    // setScrollY(false);
  }

  async function getMyShows(currentUser) {
    setLoading(true);
    const uploader = currentUser ? currentUser : userId;
    try {
      const response = await api.get(
        `/shows/filtered?uploadedBy=${uploader}&page=${currentPage}`
      );
      const { total, totalPages, showsData } = response.data;
      setUserShows(showsData);
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
    if (updates === "idle") getMyShows(selectedUser);
  }, [currentPage, updates, modalData, selectedUser]);

  return (
    <div className="h-full overflow-hidden pb-50">
      <div className="flex items-center px-4 py-1 bg-secondary rounded-md justify-between border mb-4 ">
        <div className="flex w-[25%] gap-6 items-center">
          <input
            type="checkbox"
            checked={
              selected.length > 0 && selected.length === userShows.length
            }
            onChange={handleSelectAll}
            className="w-7 h-7 border rounded-sm appearance-none accent-primary checked:appearance-auto"
          />
          <div className="py-4 flex-1 ">
            <p>Title</p>
          </div>
        </div>
        <div className="w-[20%] ">
          <p>Uploaded By</p>
        </div>
        <div className="w-[20%] ">
          <p>Uploader Email</p>
        </div>
        <div className="flex gap-2 ">
          <button
            type="button"
            disabled={selected.length === 0}
            onClick={() => handleModal(true, "edit-many")}
            className="bg-primary p-2 flex justify-center items-center rounded-md disabled:bg-gray-400/40 disabled:cursor-default!"
          >
            <Pencil />
          </button>
          <button
            type="button"
            disabled={selected.length === 0}
            onClick={() => handleModal(true, "delete-many")}
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
        ) : userShows && userShows.length > 0 ? (
          <>
            {userShows.map((show) => (
              <PanelShowTile
                key={show._id}
                show={show}
                setScrollY={setScrollY}
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
        {modalData.isOpen && (
          <ShowModal
            modalType={modalData.type}
            setModalData={setModalData}
            token={tempToken}
            selected={selected}
            setSelected={setSelected}
            setScrollY={setScrollY}
            setUpdates={setUpdates}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserShows;
