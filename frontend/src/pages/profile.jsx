import { Link, Navigate, useParams } from "react-router-dom";
import { useUserStore } from "../stores/user-store";
import { useEffect, useState } from "react";
import { House } from "lucide-react";
import axios from "axios";
import ProfileLayout from "../my-components/profile-layout";
import NoShowsFound from "../my-components/no-shows-found";
import ProfileModal from "../my-components/profile-modal";
import api from "../lib/axios-utils";

function Profile() {
  const { id } = useParams();

  const { userId, role } = useUserStore((s) => s.userData);
  const userLoading = useUserStore((s) => s.userLoading);

  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState(true);

  const [modalData, setModalData] = useState({ isOpen: false, type: "" });

  function handleModal(state, type) {
    setModalData((prev) => ({ ...prev, isOpen: state, type: type ?? "" }));
  }
  async function getUserProfile() {
    setLoading(true);
    try {
      const response = await api.get(`/users/profile/${id ?? userId}`);
      const { userData } = response.data;
      setUserProfile(userData);
      setErrMsg(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrMsg(error.response.data.message);
      } else {
        setErrMsg("Unexpected error!");
      }
      console.log(error);
      setUserProfile(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!modalData.isOpen) getUserProfile();
  }, [modalData]);

  if (userLoading || loading) return <h2>Loading</h2>;

  if (!id) return <Navigate to={`/profile/${userId}`} replace />;
  return (
    <div>
      <div className="flex gap-6 p-4 ring-1 rounded-xl items-center mb-8 backdrop-blur-sm">
        <Link to={"/"} title="exit">
          <House size={35} className="stroke-2 border-r-1 pr-2" />
        </Link>
        <h2 className="text-2xl font-bold "> Profile Details </h2>{" "}
      </div>
      {id == 0 ? (
        <NoShowsFound msg="This account was removed" />
      ) : errMsg ? (
        <NoShowsFound msg={errMsg} />
      ) : (
        <div className="w-full flex flex-col justify-start items-center mx-auto bg-hover/20 backdrop-blur-sm p-6 lg:p-12  rounded-xl gap-12">
          <ProfileLayout
            profile={userProfile}
            setProfile={setUserProfile}
            userId={userId}
            handleModal={handleModal}
            role={role}
          />
        </div>
      )}
      {modalData.isOpen && (
        <ProfileModal
          modalType={modalData.type}
          setModalData={setModalData}
          personalInfo={{
            fullName: userProfile.fullName,
            email: userProfile.email,
          }}
          profile={userProfile}
        />
      )}
    </div>
  );
}

export default Profile;
