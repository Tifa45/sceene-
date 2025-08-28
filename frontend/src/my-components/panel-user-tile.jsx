import { Link } from "react-router-dom";
import { formatUserFullName } from "../lib/utliles";

function PanelUserTile({ user, selected, setSelected, setDetails }) {
  function handleSelect(currentUser) {
    if (selected.includes(currentUser._id)) {
      const filtered = selected.filter(
        (selectedUser) => selectedUser !== currentUser._id
      );
      setSelected(filtered);
    } else {
      setSelected((selected) => [...selected, currentUser._id]);
    }
  }

  return (
    <div className="flex  items-center px-4 py-2 rounded-md border ">
      <div className="flex w-[20%] gap-2 items-center ">
        <div>
          <input
            type="checkbox"
            checked={selected.length > 0 && selected.includes(user._id)}
            onChange={() => handleSelect(user)}
            className="w-7 h-7 mr-2 border rounded-sm appearance-none accent-secondary checked:appearance-auto"
          />
        </div>
        <div className="py-4 flex-1 text-nowrap overflow-x-scroll [&::-webkit-scrollbar]:h-1  [&::-webkit-scrollbar-thumb]:bg-gray-500/50 [&::-webkit-scrollbar-thumb]:rounded-md transition-all ease-in-out duration-300">
          <Link to={`/profile/${user._id}`} title={user.fullName}>
            {formatUserFullName(user.fullName)}
          </Link>
        </div>
      </div>
      <div className="w-[18%] overflow-x-scroll [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-gray-500/50 [&::-webkit-scrollbar-thumb]:rounded-md">
        <Link to={`/profile/${user._id}`}>{user.email}</Link>
      </div>
      <div className="w-[20%]">
        <button
          type="button"
          onClick={() =>
            setDetails({
              isOpen: true,
              selectedUser: user._id,
              type: "seeUserShows",
            })
          }
          className="p-2 bg-hover border rounded-md hover:brightness-125"
        >
          {" "}
          Shows
        </button>
      </div>
      <div className="w-[20%]">
        <button
          type="button"
          onClick={() =>
            setDetails({
              isOpen: true,
              selectedUser: user._id,
              type: "seeUserComments",
            })
          }
          className="p-2 bg-secondary border rounded-md hover:brightness-125"
        >
          {" "}
          Comments
        </button>
      </div>
      <div className="w-[20%]">
        <button
          type="button"
          onClick={() =>
            setDetails({
              isOpen: true,
              selectedUser: user._id,
              type: "seeUserActivities",
            })
          }
          className="p-2 bg-green-900 border rounded-md hover:brightness-125"
        >
          {" "}
          Actitvities
        </button>
      </div>
    </div>
  );
}

export default PanelUserTile;
