import { useForm } from "react-hook-form";
import { useUserStore } from "../stores/user-store";
import axios from "axios";
import api from "../lib/axios-utils";
import { toast } from "sonner";

function ChangePasswordForm({ setModalData }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
  } = useForm({ mode: "onBlur" });

  const newPassword = watch("password");

  async function onSubmit(data) {
    const { currentPassword, password } = data;
    const body = { currentPassword, password };
    try {
      await api.patch("/users/update", body);
      toast.success("Updated");
      setModalData((data) => ({ ...data, isOpen: false, type: "" }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError("root", {
          message: error.response.data.message ?? error.message,
        });
      } else {
        setError("root", { message: "Unexpected error" });
      }
    }
  }

  return (
    <div className="w-full ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full"
      >
        <div className="edit-profile-field ">
          <label htmlFor="currentPassword">Current password:</label>
          <input
            {...register("currentPassword", {
              required: "Current password is required",
            })}
            id="currentPassword"
            type="password"
          />
          {errors.currentPassword && <p>{errors.currentPassword.message}</p>}
        </div>
        <div className="edit-profile-field ">
          <label htmlFor="newPassword">New Password:</label>
          <input
            {...register("password", {
              required: "New Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least six chars",
              },
            })}
            id="newPassword"
            type="password"
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <div className="edit-profile-field ">
          <label htmlFor="confirmNewPassword">Confirm New Password:</label>
          <input
            {...register("confirmNewPassword", {
              validate: (v) =>
                v === newPassword || "New password is not matched",
              required: "You must rewrite your new password",
            })}
            id="confirmNewPassword"
            type="password"
          />
          {errors.confirmNewPassword && (
            <p>{errors.confirmNewPassword.message}</p>
          )}
        </div>
        {errors.root && <p className="text-red-500"> {errors.root.message}</p>}
        <div className="flex justify-end gap-4 items-center">
          <button
            onClick={() =>
              setModalData((data) => ({ ...data, isOpen: false, type: "" }))
            }
            type="button"
            disabled={isSubmitting}
            className={`bg-gray-500 p-2 rounded-lg hover:brightness-120 text-black disabled:bg-white disabled:cursor-pointer!`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-hover p-2 rounded-lg hover:brightness-120 disabled:bg-white disabled:text-black disabled:cursor-pointer!`}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangePasswordForm;
