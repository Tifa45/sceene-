import { useForm } from "react-hook-form";
import { useUserStore } from "../stores/user-store";
import axios from "axios";
import api from "../lib/axios-utils";
import { toast } from "sonner";
function EditPersonalInfoForm({ personalInfo, setModalData }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({ defaultValues: personalInfo, mode: "onBlur" });

  async function onSubmit(data) {
    const body = { ...data };
    try {
      await api.patch("/users/update", body);
      toast.success("Saved");

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
    <div className="w-full flex">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full"
      >
        <div className="edit-profile-field ">
          <label htmlFor="name">Full name:</label>
          <input
            {...register("fullName", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least two chars",
              },
              validate: (v) => v.trim().length > 0 || "Name can not be empty",
            })}
            id="name"
            type="text"
          />
          {errors.fullName && <p>{errors.fullName.message}</p>}
        </div>
        <div className="edit-profile-field ">
          <label htmlFor="email">Email:</label>
          <input
            {...register("email", {
              required: "Name is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
            id="email"
            type="text"
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        {errors.root && <p className="text-red-500"> {errors.root.message}</p>}
        <div className="flex justify-end gap-4 items-center">
          <button
            onClick={() =>
              setModalData((data) => ({ ...data, isOpen: false, type: "" }))
            }
            type="button"
            disabled={isSubmitting}
            className="cancel-btn"
          >
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="submit-btn">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditPersonalInfoForm;
