import { Star, Pencil, Trash2, Eye } from "lucide-react";

import FavoritBtn from "./favorite-btn";
import { useUserStore } from "../stores/user-store";
import { Link } from "react-router-dom";
import { toast } from "sonner";

function DetailsCard({ show, handleModal }) {
  const role = useUserStore((s) => s.userData.role);
  const userId = useUserStore((s) => s.userData.userId);
  const canEdit = role === "admin" || show.uploadedBy === userId;

  return (
    <div className="overflow-hidden w-full flex flex-col md:flex-row gap-20 p-4 max-w-7xl mr-auto  rounded-md shadow-md shadow-black relative isolate">
      <div
        className="absolute inset-0 -z-10 blur-sm "
        style={{
          backgroundImage: `linear-gradient(
      180deg,
      #020412 0%,
      #020412 15%,
      transparent 60%,
     #020412 100%
    ), url(${show.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="w-full md:w-[30%] flex flex-col ">
        <div className="w-full h-[22rem] md:h-auto md:aspect-[2/3] rounded-md overflow-hidden">
          <img className="w-full h-full" src={show.image} alt={show.title} />
        </div>
        <div className="w-full pt-4 flex flex-col gap-4 mt-auto  ">
          <div >
            <button
              type="button"
              onClick={() => {if(!userId){toast.info("Login to rate shows")} else {handleModal(true, "rating")}}}
              className="details-btn-pub w-full  "
            >
              <Star /> <span>Rate</span>
            </button>
          </div>
          {canEdit && (
            <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-center  ">
              <button
                type="button"
                onClick={() => handleModal(true, "edit")}
                className="details-btn-edit"
              >
                <span>Edit</span> <Pencil />
              </button>
              <button
                type="button"
                onClick={() => handleModal(true, "delete")}
                className="details-btn-delete"
              >
                <span>Delete</span> <Trash2 />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-8">
        <div className="border-b-1 pb-4">
          <h1>{show.title}</h1>
        </div>
        <div className="flex gap-4">
          {show.genre && show.genre.length > 0
            ? show.genre.map((genre) => (
                <Link
                  key={genre}
                  to={`/?genre=${genre}`}
                  title={`See ${genre} shows`}
                >
                  <button
                    key={genre}
                    type="button"
                    className="bg-secondary py-1 px-2 border rounded-md text-md text-gray-400 cursor-pointer"
                  >
                    {genre}
                  </button>
                </Link>
              ))
            : "no genre"}
        </div>
        <div className="max-h-50 overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-500/50 [&::-webkit-scrollbar-thumb]:rounded-md ">
          <p>{show.description}</p>
        </div>
        <div className="mt-auto flex flex-col  md:items-center gap-6 md:flex-row md:gap-18 md:justify-start">
          <div className="flex flex-col items-center gap-2 ">
            <div className="flex gap-2 items-center">
              <Star className={`${show.totalRates && "fill-amber-400"}`} />
              <span className=" text-md ">
                {show.totalRates ? show.avgRate : ""}
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              {show.totalRates && show.totalRates > 0
                ? `${show.totalRates} rate`
                : "No rates yet"}
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 ">
            <div className="flex gap-2 items-center">
              <Eye />
              <span className=" text-md">{show.views}</span>
            </div>
            <p className="text-gray-400 text-sm">Total views</p>
          </div>
          <div className="flex-1 flex">
            <FavoritBtn styles="details-fav-btn" showId={show._id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsCard;
