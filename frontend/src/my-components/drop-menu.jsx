import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, PanelTopClose } from "lucide-react";
import { navLinks } from "../lib/constans";
import useClickOutSide from "../hooks/useClickOutSide";
import { useUserStore } from "../stores/user-store";

function DropMenu() {
  const [expand, setExpand] = useState(false);
  const user = useUserStore((s) => s.userData);
  const {pathname} = useLocation();

  const toggleExpand = () => setExpand(!expand);
  const ref = useClickOutSide(() => setExpand(false));

  useEffect(() => {
    setExpand(false);
  }, [pathname]);

  return (
    <div ref={ref} className="ralative">
      <button
        onClick={toggleExpand}
        type="button"
        className="cursor-pointer active:scale-95 transition-all duration-300"
      >
        {expand ? <PanelTopClose size={40} /> : <Menu size={40} />}
      </button>
      {expand && (
        <div className="dropmenu text-center ">
          <ul className="list-none ">
            {navLinks.map((link) => (
              <li
                key={link.title}
                className="py-4 border-b-1 border-gray-400  active:bg-hover transition-all duration-300"
              >
                <NavLink to={`/${link.route}`} className={({isActive})=>`${isActive&&"text-amber-500"}`}>
                  <p>{link.title}</p>
                </NavLink>
              </li>
            ))}
          </ul>
          {!user.userId && (
            <Link
              to="/signin"
              className="bg-btn p-4 rounded-md block mt-4 active:bg-hover "
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default DropMenu;
