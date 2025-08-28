import { Clapperboard, Star, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import FavoritBtn from "./favorite-btn";
function ShowCard({ show }) {
  return (
    <div className=" card-effect ">
      <div className=" flex flex-col gap-4">
        <div className="w-full overflow-hidden rounded-lg h-[18rem]">
          <img className="w-full h-full" src={show.image} alt={show.title} />
        </div>
        <div className="w-full my-4">
          <Link to={`/shows/${show._id}`} title={show.title}>
            <h2 className="text-nowrap overflow-ellipsis truncate text-3xl font-normal">
              {show.title}
            </h2>
          </Link>
        </div>

        <div className="w-full flex  mb-2">
          <div className="w-[45%] text-gray-500">
            <Star className="inline mr-2" /> {show.avgRate}
          </div>
          <div className="w-[45%] text-gray-500">
            <Eye className="inline mr-2" /> {show.views}
          </div>
          <div>{show.category}</div>
        </div>
        <div className="w-full flex flex-col md:flex-row md:items-center  gap-4 ">
          <Link to={`/shows/${show._id}`} title={show.title} className="flex">
            <button
              type="button"
              className="py-2 px-3 bg-btn flex-1 cursor-pointer rounded-md border"
            >
              <span>See More</span>{" "}
              <Clapperboard size={20} className="inline" />
            </button>
          </Link>

          <FavoritBtn styles="card-fav-btn " showId={show._id} />
        </div>
      </div>
    </div>
  );
}

export default ShowCard;
