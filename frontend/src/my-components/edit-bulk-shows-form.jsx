import { Controller, useForm } from "react-hook-form";
import { genres, categories } from "../lib/constans";
import axios from "axios";
import api from "../lib/axios-utils";
import { toast } from "sonner";

function EidtBulkShowsForm({ selected, setSelected, handleCloseModal }) {
  const {
    register,
    setError,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { category: "", genre: [] } });

  const assignGenres = watch("assign");

  async function onSubmit(data) {
    const ids = selected.map((selectedShow) => selectedShow.id);
    const validFields = {};
    if (data.category.trim().length > 0) validFields.category = data.category;
    if (data.assign) validFields.genre = data.genre;

    if (Object.keys(validFields).length === 0) {
      setError("root", { message: "You have to choose at least one update!" });
      return;
    }

    const body = { showsToUpdate: ids, fieldsToupdate: validFields };

    try {
      const request = api.patch("/shows/update-many", body);
      toast.promise(request, {
        loading: "Updating",
        success: "Updated successfullly",
      });
      await request;
      setSelected([]);
      handleCloseModal();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError("root", {
          message: error.response.data.message || error.message,
        });
      } else {
        setError("root", { message: "Unexpected error!" });
      }
      console.log(error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 flex-1"
    >
      <div className="edit-profile-field ">
        <label htmlFor="category">Category:</label>
        <div className="cursor-pointer bg-white text-black p-2 rounded-md">
          <select
            id="category"
            className="w-full outline-none"
            {...register("category")}
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        {errors.category && <p>{errors.category.message}</p>}
      </div>
      <div className="edit-profile-field p-4 border rounded-2xl">
        <div className="flex gap-4 items-center">
          <input type="checkbox" {...register("assign")} />{" "}
          <span>Assign Genres: </span>
        </div>
        <Controller
          control={control}
          name="genre"
          render={({ field }) => (
            <div className="flex flex-wrap gap-4">
              {genres.map((genre) => (
                <div
                  key={genre}
                  className="px-2 py-1.5 hover:text-amber-400 bg-secondary text-nowrap"
                >
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      disabled={!assignGenres}
                      className="accent-primary"
                      value={genre}
                      checked={
                        (field.value?.includes(genre) && assignGenres) || false
                      }
                      onChange={(e) => {
                        const newValue = e.target.checked
                          ? [...field.value, genre]
                          : field.value.filter((v) => v !== genre);
                        field.onChange(newValue);
                      }}
                    />
                    {genre}
                  </label>
                </div>
              ))}
            </div>
          )}
        />
      </div>
      {errors.root && (
        <p className="text-red-500 mt-4">{errors.root.message} </p>
      )}
      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={handleCloseModal}
          disabled={isSubmitting}
          className="cancel-btn"
        >
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="submit-btn">
          Save
        </button>
      </div>
    </form>
  );
}

export default EidtBulkShowsForm;
