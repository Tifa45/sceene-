import useClickOutSide from "../hooks/useClickOutSide";
import ConfirmTile from "./confirm-tile";
import axios from "axios";
import { useUserStore } from "../stores/user-store";
import { motion } from "framer-motion";
import { defaultProps, modalOutlayVars, modalTileVars } from "../lib/constans";
import api from "../lib/axios-utils";
import { toast } from "sonner";

function ManageUserModal({ setModalData, selected, setSelected }) {
  async function deleteUser() {
    try {
      const request = api.delete("/users/delete", {
        data: { targetedUser: selected },
      });
      toast.promise(request, {
        loading: "Processing",
        success: "Deleted successfully",
        error: (err) => err.response.data.message || err.message,
      });
      await request;
      setSelected([]);
      setModalData(false);
    } catch (error) {
      console.log(error);
    }
  }

  const profileModalRef = useClickOutSide(() => setModalData(false));
  return (
    <motion.div
      {...defaultProps}
      variants={modalOutlayVars}
      className="absolute inset-0 w-full h-[100vh] z-20 bg-black/25 grid place-items-center "
    >
      <motion.div
        variants={modalTileVars}
        ref={profileModalRef}
        className="w-[80%] max-w-5xl bg-primary  ring-4 rounded-lg flex flex-col items-center p-8 gap-12 relative"
      >
        <ConfirmTile
          handleCloseModal={() => setModalData(false)}
          setModalData={setModalData}
          action={deleteUser}
          title="Confirm Delete Users"
          btnTxt="Delete"
        />
      </motion.div>
    </motion.div>
  );
}

export default ManageUserModal;
