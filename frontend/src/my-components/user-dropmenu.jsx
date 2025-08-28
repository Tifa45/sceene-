import { useUserStore } from "../stores/user-store";
import { formatUserFirstName, formatUserInitials } from "../lib/utliles";
import useIsDesktop from "../hooks/useIsDesktop";
import useClickOutSide from "../hooks/useClickOutSide";
import { useEffect, useState } from "react";
import { Heart, UserRoundPen, FileSliders, LogOut } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { handleLogout } from "../lib/utliles";

function UserDropMenu({ tabsData }) {
  const [expand, setExpand] = useState(false);
  const userName = useUserStore((s) => s.userData.name);
  const isDesktop = useIsDesktop();
  const { pathname } = useLocation();
  const menuRef = useClickOutSide(() => setExpand(false));

  const iconRender = (title) => {
    let element;
    switch (title) {
      case "Favorites":
        element = <Heart />;
        break;
      case "Profile":
        element = <UserRoundPen />;
        break;
      default:
        element = <FileSliders />;
        break;
    }
    return element;
  };
  useEffect(() => {
    setExpand(false);
  }, [pathname]);

  return (
    <div ref={menuRef} className="ralative">
      <div>
        <button
          type="button"
          onClick={() => setExpand(!expand)}
          className={`${
            !isDesktop &&
            "bg-secondary w-12 h-12 rounded-full  text-md text-nowrap"
          }  hover:text-white`}
        >
          {isDesktop
            ? formatUserFirstName(userName)
            : formatUserInitials(userName)}
        </button>
      </div>
      {expand && (
        <div className="dropmenu">
          <ul className="list-none">
            {tabsData.map((tab) => (
              <li
                key={tab.title}
                className=" border-b-1 mb-2 py-2 border-gray-400 "
              >
                <div className="p-3  hover:bg-primary rounded-xl transition-all duration-300">
                  <NavLink
                    to={`/${tab.route}`}
                    title={tab.title}
                    className={({ isActive }) =>
                      `flex gap-4 items-center ${
                        isActive ? "text-amber-500" : ""
                      }`
                    }
                  >
                    {iconRender(tab.title)} <span>{tab.title}</span>
                  </NavLink>
                </div>
              </li>
            ))}
          </ul>
          <div className=" py-2  ">
            <button
              type="button"
              onClick={handleLogout}
              className="p-3  hover:bg-primary rounded-xl transition w-full flex gap-4"
            >
             <LogOut /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDropMenu;
