import { useState } from "react";
import { useUserStore } from "../stores/user-store";
import { ChevronRight, Pencil, Search, Trash2 } from "lucide-react";
import axios from "axios";
import { useEffect } from "react";
import PanelUserTile from "./panel-user-tile";
import NoShowsFound from "./no-shows-found";
import Pagination from "./pagination";
import UserShows from "./user-shows";
import ManageUserModal from "./manage-user-modal";
import UserComments from "./user-comments";
import Actitvities from "./activities";
import api from "../lib/axios-utils";
import { AnimatePresence } from "framer-motion";
function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [totalFound, setTotalFound] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState([]);

  const [modalData, setModalData] = useState(false);

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState(null);

  const [detials, setDetails] = useState({
    isOpen: false,
    selectedUser: "",
    type: "",
  });

  const detailsMap = {
    seeUserShows: <UserShows selectedUser={detials.selectedUser} />,
    seeUserComments: <UserComments selectedUser={detials.selectedUser} />,
    seeUserActivities: <Actitvities selectedUser={detials.selectedUser} />,
  };

  function handleSelectAll() {
    const usersIds = users.map((user) => user._id);
    if (selected.length !== usersIds.length) {
      setSelected(usersIds);
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

  async function getUsers(searchUser) {
    setLoading(true);
    const url = `http://localhost:5000/api/users/find-user?page=${
      searchUser ? 0 : currentPage
    }&search=${search}`;
    try {
      const response = await api.get(
        `/users/find-user?page=${searchUser ? 0 : currentPage}&search=${search}`
      );

      const { total, totalPages, usersData } = response.data;
      setUsers(usersData);
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
    if (search.length === 0 || (search.length > 0 && currentPage > 0))
      getUsers();
  }, [modalData, search]);

  return (
    <div className="h-full overflow-hidden pb-50 relative">
      <div
        className={`z-60 absolute w-full pb-12 inset-0 bg-primary ${
          detials.isOpen ? "translate-x-0" : "translate-x-[100%]"
        } transition-all duration-300 ease-in-out `}
      >
        <button onClick={() => setDetails({ isOpen: false, selectedUser: "" })}>
          <ChevronRight size={30} />
        </button>
        {detailsMap[detials.type]}
      </div>
      <div className="relative w-fit p-2">
        <button
          type="button"
          disabled={search.trim().length === 0}
          onClick={() => getUsers(true)}
          className="absolute top-4 right-4 disabled:text-gray-500 disabled:cursor-default! "
        >
          <Search />
        </button>
        <input
          type="text"
          placeholder="Find by name or email..."
          className="p-2 border bg-none rounded-lg placeholder:text-gray-500!"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex items-center px-4 py-1 bg-secondary rounded-md justify-between border mb-4 ">
        <div className="flex w-[20%] gap-6 items-center">
          <input
            type="checkbox"
            checked={selected.length > 0 && selected.length === users.length}
            onChange={handleSelectAll}
            className="w-7 h-7 border rounded-sm appearance-none accent-primary checked:appearance-auto"
          />
          <div className="py-4 flex-1 ">
            <p>User Name</p>
          </div>
        </div>
        <div className="w-[20%] ">
          <p>User Email</p>
        </div>
        <div className="w-[20%] ">
          <p>User Shows</p>
        </div>
        <div className="w-[20%] ">
          <p>User Comments</p>
        </div>
        <div className="w-[20%] ">
          <p>User Activities</p>
        </div>
        <div className="flex gap-2 ">
          <button
            type="button"
            disabled={selected.length === 0}
            onClick={() => setModalData(true)}
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
        ) : (
          users &&
          users.length > 0 && (
            <>
              {users.map((user) => (
                <PanelUserTile
                  key={user._id}
                  user={user}
                  selected={selected}
                  setSelected={setSelected}
                  setDetails={setDetails}
                />
              ))}
            </>
          )
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
          <ManageUserModal
            setModalData={setModalData}
            selected={selected}
            setSelected={setSelected}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default ManageUsers;
