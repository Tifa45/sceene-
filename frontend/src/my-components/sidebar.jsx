import { useEffect, useState } from "react";
import useClickOutSide from "../hooks/useClickOutSide";
import useIsDesktop from "../hooks/useIsDesktop";
import { PanelRight } from "lucide-react";

function Sidebar({ openSidebar, setOpenSidebar, tabs, setControl, control }) {
  const isDesktop = useIsDesktop();
  const sidebarRef = useClickOutSide(() => {
    const doIt = window.innerWidth > 768;
    !doIt && setOpenSidebar(false);
  });

  return (
    <div>
      {openSidebar && !isDesktop && (
        <div className="w-full h-full bg-black/40 absolute inset-0 z-10"></div>
      )}

      <div
        ref={sidebarRef}
        className={`w-12 p-2 h-full backdrop-blur-2xl transition-all duration-700 ease-in-out rounded-md overflow-hidden ${
          openSidebar && "w-60"
        } ${!isDesktop && "z-20 absolute left-0 "}`}
      >
        <div
          className={`p-4 flex flex-col gap-6 ${
            !openSidebar && "items-center"
          } `}
        >
          {openSidebar && (
            <div>
              <a href="/">
                <h1 className="text-4xl m-0">
                  S<p className="text-amber-500 inline m-0">c</p>EEN
                  <p className="text-amber-500  inline">e</p>
                </h1>
              </a>
            </div>
          )}
          <div className="max-h-[40vh] flex flex-col gap-4">
            {!isDesktop && !openSidebar && (
              <button
                type="button"
                onClick={() => setOpenSidebar(true)}
                className="p-2"
              >
                <PanelRight />
              </button>
            )}
            {tabs.map((tab) => {
              const isActive = tab.control === control;
              return (
                <div key={tab.title} className=" rounded-md hover:bg-hover ">
                  <button
                    type="button"
                    onClick={() => setControl(tab.control)}
                    className={`flex gap-4 transition-all duration-300 ease-in-out p-2 ${
                      isActive && "text-amber-500 font-extrabold"
                    }`}
                  >
                    <tab.icon />{" "}
                    <span
                      className={`hidden ${openSidebar && "inline"} truncate`}
                    >
                      {tab.title}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
