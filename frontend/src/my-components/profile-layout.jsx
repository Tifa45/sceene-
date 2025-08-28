import {
  formatDate,
  formatUserFullName,
  formatUserFirstName,
} from "../lib/utliles";
import { Pencil, BrushCleaning } from "lucide-react";
import { roles } from "../lib/constans";
import { useState } from "react";
import axios from "axios";
import { useUserStore } from "../stores/user-store";
import api from "../lib/axios-utils";

function ProfileLayout({ profile, userId, handleModal, role, setProfile }) {
  const sameUser = profile._id === userId;
  const isAdmin = role === "admin";
  const [roleValue, setRoleValue] = useState(null);
  const disabled = roleValue === null || roleValue === role;

  async function updateUserRole() {
    try {
      const response = await api.patch("/users/update", {
        userToUpdateId: profile._id,
        role: roleValue,
      });
      setProfile((prev) => ({ ...prev, role: response.data.role }));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="profile-tile">
        <h2 className="text-2xl font-bold text-blue-300">
          {formatUserFullName(profile.fullName)}
        </h2>
        <p>{profile.email}</p>
        <p>{`since ${formatDate(profile.createdAt)}`}</p>
      </div>
      <div className="profile-tile">
        <div className="border-b-[0.01rem] border-gray-400 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-blue-300 ">
            Personal Information
          </h2>
          {(sameUser || profile.role === "admin") && (
            <div>
              <button
                type="button"
                onClick={() => handleModal(true, "personal-info")}
              >
                <Pencil />
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4 p-2 ">
          <span className="text-base font-light text-gray-500">Full Name:</span>
          <p>{formatUserFullName(profile.fullName)}</p>
        </div>
        <div className="flex flex-col md:flex-row mt-2 gap-4 md:gap-0 ">
          <div className="personal-info-d">
            <span className="text-base font-light text-gray-500">Emial:</span>
            <p>{profile.email}</p>
          </div>
          <div className="personal-info-d">
            <span className="text-base font-light text-gray-500">
              Member Since:
            </span>
            <p>{formatDate(profile.createdAt)}</p>
          </div>
          <div className="personal-info-d md:text-center ">
            <span className="text-base font-light text-gray-500">Role:</span>
            {isAdmin ? (
              <div className="w-fit  ml-[40%] flex gap-4">
                <div className="cursor-pointer bg-white text-black p-2 rounded-md">
                  <select
                    name="role"
                    id="role"
                    value={roleValue ?? profile.role}
                    onChange={(e) => setRoleValue(e.target.value)}
                  >
                    {roles.map((rol) => (
                      <option key={rol} value={rol}>
                        {formatUserFirstName(rol)}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={updateUserRole}
                  type="button"
                  disabled={disabled}
                  className={`${disabled && "disabled-txt"}`}
                >
                  Save
                </button>
              </div>
            ) : (
              <p>{profile.role}</p>
            )}
          </div>
        </div>
      </div>
      {sameUser ? (
        <div className="profile-tile">
          <div className="border-b-[0.01rem] border-gray-400 p-4">
            <h2 className="text-2xl font-bold text-blue-300 ">Security</h2>
          </div>
          <div className="flex gap-8 items-center mt-2">
            <button
              type="button"
              onClick={() => handleModal(true, "change-password")}
              className="profile-btn bg-secondary hover:brightness-120"
            >
              Change Password <Pencil />
            </button>
            <button
              type="button"
              onClick={() => handleModal(true, "delete-account")}
              className="profile-btn bg-red-800 hover:brightness-120"
            >
              Delete Account <BrushCleaning />
            </button>
          </div>
        </div>
      ) : (
        isAdmin && (
          <div className="profile-tile">
            <div className="border-b-[0.01rem] border-gray-400 p-4">
              <h2 className="text-2xl font-bold text-blue-300 ">Security</h2>
            </div>
            <div className="flex gap-8 items-center mt-2">
              <button
                type="button"
                onClick={() => handleModal(true, "reset-password")}
                className="profile-btn bg-secondary hover:brightness-120"
              >
                Reset Password <Pencil />
              </button>
              <button
                type="button"
                onClick={() => handleModal(true, "delete-account")}
                className="profile-btn bg-red-800 hover:brightness-120"
              >
                Delete Account <BrushCleaning />
              </button>
            </div>
          </div>
        )
      )}
    </>
  );
}

export default ProfileLayout;
