import useClickOutSide from "../hooks/useClickOutSide";
import ChangePasswordForm from "./change-password-form";
import ConfirmTile from "./confirm-tile";
import EditPersonalInfoForm from "./edit-personal-info-form";
import axios from "axios";
import { useUserStore } from "../stores/user-store";
import api from "../lib/axios-utils";
import { toast } from "sonner";

function ProfileModal({ modalType, setModalData, personalInfo, profile }) {
  async function deleteUser() {
    try {
      const request = api.delete("/users/delete", {
        data: { targetedUser: profile._id },
      });
      toast.promise(request, {
        loading: "Processing",
        success: "Deleted successfully",
        error: (err) => err.response.data.message || err.message,
      });
      await request;
      setModalData((data) => ({ ...data, isOpen: false, type: "" }));
    } catch (error) {
      console.log(error);
    }
  }

  async function resetPassword() {
    try {
      const request = api.patch("/users/reset-password", {
        targetedUser: profile._id,
      });
      toast.promise(request, {
        loading: "Processing",
        success: "Updated successfully",
        error: (err) => err.response.data.message || err.message,
      });
      await request;
      setModalData((data) => ({ ...data, isOpen: false, type: "" }));
    } catch (error) {
      console.log(error);
    }
  }

  const profileModalRef = useClickOutSide(() =>
    setModalData((data) => ({ ...data, isOpen: false, type: "" }))
  );
  const handleCloseModal = () =>
    setModalData((data) => ({ ...data, isOpen: false, type: "" }));
  return (
    <div className="absolute inset-0 w-full h-[100vh] z-20 bg-black/25 grid place-items-center ">
      <div
        ref={profileModalRef}
        className="w-[80%] max-w-5xl bg-primary  ring-4 rounded-lg flex flex-col items-center p-8 gap-12 relative"
      >
        {modalType === "personal-info" ? (
          <EditPersonalInfoForm
            personalInfo={personalInfo}
            setModalData={setModalData}
          />
        ) : modalType === "change-password" ? (
          <ChangePasswordForm setModalData={setModalData} />
        ) : modalType === "delete-account" ? (
          <ConfirmTile
            setModalData={setModalData}
            handleCloseModal={handleCloseModal}
            action={deleteUser}
            title={"Confirm delete account"}
            btnTxt="Delete"
          />
        ) : (
          modalType === "reset-password" && (
            <ConfirmTile
              setModalData={setModalData}
              handleCloseModal={handleCloseModal}
              action={resetPassword}
              title="Confirm reset password"
              btnTxt="Reset"
            />
          )
        )}
      </div>
    </div>
  );
}

export default ProfileModal;
