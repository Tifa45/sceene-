import { useState } from "react";
import { moderatorPanel } from "../lib/constans";
import { PanelRight, ChevronRight } from "lucide-react";
import { useUserStore } from "../stores/user-store";
import { Navigate } from "react-router-dom";
import NoShowsFound from "../my-components/no-shows-found";
import Sidebar from "../my-components/sidebar";
import { formatUserFirstName } from "../lib/utliles";
import AddShows from "../my-components/add-shows";
import UserShows from "../my-components/user-shows";
import ManageUsers from "../my-components/manage-users";
import Actitvities from "../my-components/activities";
import useIsDesktop from "../hooks/useIsDesktop";
import { Toaster } from "@/components/ui/sonner";

function Panel() {
  const userLoading = useUserStore((s) => s.userLoading);
  const tempToken = useUserStore((s) => s.tempToken);
  const { userId, role } = useUserStore((s) => s.userData);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [control, setControl] = useState("userShows");
  const [scrollY, setScrollY] = useState(true);

  const isDesktop = useIsDesktop();

  const controlMap = {
    userShows: {
      element: <UserShows scrollY={scrollY} setScrollY={setScrollY} />,
      title: "User Shows",
    },
    addShows: { element: <AddShows />, title: "Add Shows" },
    manageUsers: {
      element: <ManageUsers />,
      title: "Manage Users",
    },
    activities: {
      element: <Actitvities />,
      title: "Activities",
    },
  };

  if (userLoading) return <NoShowsFound msg="Loading" />;

  if (!userId) return <Navigate to={"/"} />;

  return (
    <div className={`w-full h-full overflow-hidden flex relative  `}>
      <Sidebar
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
        tabs={moderatorPanel}
        control={control}
        setControl={setControl}
      />

      <div className={`flex-1 border-l-1 ${!isDesktop ? "pl-12" : ""} `}>
        <div className=" flex gap-4 p-4 backdrop-blur-2xl rounded-md ">
          {isDesktop && (
            <button type="button" onClick={() => setOpenSidebar(!openSidebar)}>
              <PanelRight />
            </button>
          )}
          <div className="flex gap-4 items-center">
            <h2 className="text-xl font-bold">
              {formatUserFirstName(role)} Panel
            </h2>
            <ChevronRight /> {controlMap[control].title}
          </div>
        </div>
        <div className="h-full bg-primary p-4">
          {controlMap[control].element}
        </div>
      </div>
      <Toaster richColors position="bottom-right" expand={true} />
    </div>
  );
}

export default Panel;
