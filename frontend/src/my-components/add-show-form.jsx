import { useEffect, useState } from "react";
import { Plus, Trash2, Hand, ChevronRight } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { genres, categories } from "../lib/constans";
import axios from "axios";
import NoShowsFound from "./no-shows-found";
import api from "../lib/axios-utils";
import { toast } from "sonner";

function AddShowForm({ showsToAdd, setShowsToAdd, setFormsCount }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      genre: [],
      year: "",
    },
    mode: "onBlur",
  });

  const [preview, setPreview] = useState(null);
  const [removedImg, setRemovedImg] = useState(false);

  const [tempShowData, setTempShowData] = useState({});
  const [expand, setexpand] = useState(false);

  const [errMsg, setErrMsg] = useState(null);

  const saved = Object.keys(tempShowData).length > 0;

  const currentData = {
    title: watch("title"),
    description: watch("description"),
    category: watch("category"),
    genre: watch("genre"),
    year: watch("year"),
    image: preview,
  };

  const compareChanges = {};
  for (const field in currentData) {
    if (currentData[field] && currentData[field].length !== 0) {
      compareChanges[field] = currentData[field];
    }
  }
  const noChanges = Object.keys(compareChanges).every((key) => {
    if (Array.isArray(compareChanges[key])) {
      return (
        JSON.stringify(compareChanges[key].sort()) ===
        JSON.stringify(tempShowData[key].sort())
      );
    }

    return compareChanges[key] === tempShowData[key];
  });

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
      await api.post("/shows/delete-img", { publicId: path });

      setErrMsg(null);
    } catch (error) {
      console.log(error);
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
    const filtered = showsToAdd.filter(
      (added) => added.tempId !== tempShowData.tempId
    );
    setShowsToAdd(filtered);
    setFormsCount((count) => count - 1);
  }

  async function onSubmit(data) {
    const updatedImage = !removedImg ? preview && preview : null;
    let showData;
    if (Object.keys(tempShowData).length > 0) {
      showData = { ...data, image: updatedImage };
      setTempShowData((prev) => ({ ...prev, ...showData }));
      const updated = showsToAdd.map((addedShow) =>
        addedShow.tempId === tempShowData.tempId
          ? { ...addedShow, ...showData }
          : addedShow
      );
      setShowsToAdd(updated);
    } else {
      showData = { tempId: new Date(), ...data, image: updatedImage };
      setTempShowData(showData);
      setShowsToAdd((prev) => [...prev, showData]);
    }
  }

  return (
    <div
      className={`${
        !expand ? "h-10" : "h-210"
      }  overflow-hidden border rounded-lg transition-all duration-300 ease-in`}
    >
      <div className="h-10 bg-secondary box-border p-4 flex items-center  ">
        <button
          onClick={() => setexpand(!expand)}
          className="flex gap-2 items-center"
        >
          {tempShowData.title ? tempShowData.title : "New show"}{" "}
          <ChevronRight className={`${expand && "rotate-90"}`} />
        </button>
        <button
          type="button"
          onClick={handleCancelation}
          disabled={isSubmitting}
          className="ml-auto"
        >
          <Trash2 />
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-6 w-full p-4 h-full ">
        <div className="w-full flex items-center md:w-[35%] ">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="w-full h-[50%] flex justify-center items-center border-4 border-gray-300/30 group relative overflow-hidden"
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
            {preview && !removedImg ? (
              <div className="w-full h-full">
                <img src={preview} alt="" className="w-full h-full" />
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
          className="flex flex-col gap-1 flex-1 max-h-[80vh] scrolly "
        >
          <div className="edit-profile-field ">
            <label htmlFor="title">Title:</label>
            <input
              {...register("title", {
                required: "Tilte is required",
                validate: (v) =>
                  v.trim().length > 0 || "Title can not be empty",
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
                {...register("category", {
                  required: "You have to choose category",
                })}
              >
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
            <span>Genres: </span>
            <Controller
              name="genre"
              control={control}
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
              type="number"
              {...register("year", {
                valueAsNumber: true,
                min: { value: 1900, message: "Year must be >= 1900" },
                max: { value: 2099, message: "Year must be <= 2099" },
              })}
              id="year"
            />
            {errors.year && <p>{errors.year.message}</p>}
          </div>
          {errors.root && (
            <p className="text-red-500 mt-4">{errors.root.message} </p>
          )}
          <div className="w-full flex mt-auto ">
            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-btn flex-1"
            >
              {saved && noChanges
                ? "Saved"
                : !noChanges
                ? "Save changes"
                : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddShowForm;
