import { useState } from "react";
import { Plus, Trash2, Hand } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { genres, categories } from "../lib/constans";
import axios from "axios";
import NoShowsFound from "./no-shows-found";
import api from "../lib/axios-utils";
import { toast } from "sonner";

function EditShowForm({ show, handleCloseModal }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    setError,
  } = useForm({
    defaultValues: {
      title: show?.title || "",
      description: show?.description || "",
      category: show?.category || "",
      genre: show?.genre || [],
      year: show?.year || "",
    },
    mode: "onBlur",
  });

  const [preview, setPreview] = useState(null);
  const [removedImg, setRemovedImg] = useState(false);

  const [errMsg, setErrMsg] = useState(null);

  async function uploadImage(file) {
    if (!file.type.startsWith("image/")) {
      setErrMsg("Only images allowed");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const request = api.post("/shows/upload-img", formData);
      toast.promise(request, {
        loading: "Uploading",
        success: "Uploaded",
        error: (err) => err.response.data.message || err.message,
      });
      const response = await request;
      setPreview(response.data.url);
      setRemovedImg(false);

      setErrMsg(null);
    } catch (error) {
      setErrMsg(error.response.data.message || error.message);
    }
  }

  async function deleteImage(urlTodelete) {
    const splited = urlTodelete.split("/");
    const publicId = splited[splited.length - 1].split(".")[0];
    const folderName = splited[splited.length - 2];
    const path = folderName + "/" + publicId;

    try {
      const request = api.post("/shows/delete-img", { publicId: path });
      toast.promise(request, {
        loading: "Deleting",
        success: "Deleted successfully",
        error: (error) => error.response.data.message || error.message,
      });
      await request;
      setErrMsg(null);
    } catch (error) {
      setErrMsg(error.response.data.message || error.message);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (preview) {
      deleteImage(preview);
    }
    uploadImage(file);
  }

  function handleClick() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (preview) {
        deleteImage(preview);
      }
      uploadImage(file);
    };
    input.click();
  }

  function handleDeletBtn() {
    if (preview) {
      deleteImage(preview);
    }
    setRemovedImg(true);
  }

  function handleCancelation() {
    if (preview) {
      deleteImage(preview);
    }
    handleCloseModal();
  }

  async function onSubmit(data) {
    const updatedImage = !removedImg ? (preview ? preview : show.image) : null;
    if (!updatedImage) {
      deleteImage(show.image);
    }
    const body = {
      updates: { ...data, image: updatedImage },
      showToUpdate: show._id,
    };

    try {
      await api.patch("http://localhost:5000/api/shows/update", body);
      toast.success("Updated successfully");
      handleCloseModal();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError("root", {
          message: error.response.data.message || error.message,
        });
      } else {
        setError("root", { message: "Unexpected error!" });
      }
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full ">
      <div className="w-full flex items-center md:w-[35%]  ">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className=" w-full h-[50%] flex justify-center items-center border-4 border-gray-300/30 group relative overflow-hidden"
        >
          <div className="absolute w-full h-15 bg-gray-300/10 flex items-center py-4 px-12 justify-around  left-0 -top-[100%] group-hover:top-0 transition-all duration-300 z-10">
            <button
              type="button"
              onClick={handleClick}
              className="edit-img-btn"
            >
              <Plus className=" stroke-3" />
            </button>
            <button
              type="button"
              onClick={handleDeletBtn}
              className="edit-img-btn"
            >
              <Trash2 />
            </button>
          </div>
          {!removedImg && !preview && show?.image ? (
            <div className="w-full h-full">
              <img
                src={show.image}
                alt={show.title}
                className="w-full h-full"
              />
            </div>
          ) : !removedImg && preview ? (
            <div className="w-full h-full">
              <img src={preview} alt={show.title} className="w-full h-full" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <p className="text-gray-300/60">Drag an image</p>
              <Hand size={40} className="text-gray-300/60" />
            </div>
          )}
        </div>
        {errMsg && <NoShowsFound msg={errMsg} />}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 flex-1"
      >
        <div className="edit-profile-field ">
          <label htmlFor="title">Title:</label>
          <input
            {...register("title", {
              required: "Tilte is required",
              validate: (v) => v.trim().length > 0 || "Title can not be empty",
            })}
            type="text"
            id="title"
          />
          {errors.title && <p>{errors.title.message}</p>}
        </div>
        <div className="edit-profile-field ">
          <label htmlFor="description">Description:</label>
          <textarea
            rows={4}
            className="px-4 py-2 bg-gray-700"
            {...register("description")}
            type="text"
            id="description"
          />
          {errors.description && <p>{errors.description.message}</p>}
        </div>
        <div className="edit-profile-field ">
          <label htmlFor="category">Category:</label>
          <div className="cursor-pointer bg-white text-black p-2 rounded-md">
            <select
              id="category"
              className="w-full outline-none"
              {...register("category")}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="edit-profile-field p-4 border rounded-2xl">
          <span>Genres: </span>
          <Controller
            name="genre"
            control={control}
            render={({ field }) => (
              <div className="flex gap-4">
                {genres.map((genre) => (
                  <div
                    key={genre}
                    className="px-2 py-1.5 hover:text-amber-400 bg-secondary"
                  >
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="accent-primary"
                        value={genre}
                        checked={field.value.includes(genre)}
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
        <div className="edit-profile-field">
          <label htmlFor="year">Year</label>
          <input
            type="text"
            {...register("year", {
              maxLength: { value: 4, message: "Please enter valid year: YYYY" },
              minLength: { value: 4, message: "Please enter valid year: YYYY" },
            })}
            id="year"
          />
          {errors.year && <p>{errors.year.message}</p>}
        </div>
        {errors.root && (
          <p className="text-red-500 mt-4">{errors.root.message} </p>
        )}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={handleCancelation}
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
    </div>
  );
}

export default EditShowForm;
