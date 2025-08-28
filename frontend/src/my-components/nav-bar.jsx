import { Link, NavLink } from "react-router-dom";
import useIsDesktop from "../hooks/useIsDesktop";
import {
  navLinks,
  publicUser,
  moderatorUser,
  adminUser,
} from "../lib/constans";
import DropMenu from "./drop-menu";
import { useUserStore } from "../stores/user-store";

import UserDropMenu from "./user-dropmenu";
import SearchBar from "./search-bar";

function NavBar() {
  const {
    userId: isUser,
    
    role,
  } = useUserStore((s) => s.userData);

  const isDesktop = useIsDesktop();

const userDropRender = () => {
  let element;

  switch (role) {
    case "public":
      element = <UserDropMenu tabsData={publicUser} />;
      break;
    case "moderator":
      element = <UserDropMenu tabsData={moderatorUser} />;
      break;
    case "admin":
      element = <UserDropMenu tabsData={adminUser} />;
      break;
    default:
      element = <UserDropMenu tabsData={publicUser} />;
      break;
  }

  return element;
};
  return (
    <>
      <nav className="flex justify-between items-center bg-white/5 backdrop-blur-sm  px-6 py-2 rounded-lg border-1 max-w-7xl mx-auto z-20">
        <div>
          <a href="/">
            <h1 className="text-4xl m-0">
              S<p className="text-amber-500 inline m-0">c</p>EEN
              <p className="text-amber-500  inline">e</p>
            </h1>
          </a>
        </div>
        <SearchBar/>
        <div>
          {isDesktop ? (
            <div className="flex gap-8 items-center">
              <ul className=" flex gap-6 list-none">
                {navLinks.map((link) => (
                  <NavLink
                    className={({ isActive }) =>
                      `hover-underline-animation hover:text-amber-500 ${
                        isActive && "text-amber-500"
                      }`
                    }
                    key={link.title}
                    to={`/${link.route}`}
                  >
                    <p>{link.title}</p>
                  </NavLink>
                ))}
              </ul>
              {isUser ? (
                <div>{ userDropRender()}</div>
              ) : (
                <Link
                  className="bg-primary p-2 rounded-md block  hover:bg-hover border-1"
                  to={"/signin"}
                >
                  Sign in
                </Link>
              )}
            </div>
          ) : (
            <div className="z-19 flex gap-4 items-center">
              <DropMenu />
              {isUser&& <div>{ userDropRender()}</div>}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default NavBar;
