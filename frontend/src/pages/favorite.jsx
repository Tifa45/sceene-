import { useEffect, useState } from "react";
import { useUserStore } from "../stores/user-store";
import { Navigate } from "react-router-dom";
import axios from "axios";
import ShowCard from "../my-components/show-card";
import { useShowStore } from "../stores/show-store";
import api from "../lib/axios-utils";

function Favorites() {
  const isUser = useUserStore((s) => s.userData.userId);
  const userLoading = useUserStore((s) => s.userLoading);
  const favoriteShows = useShowStore((s) => s.favoriteShows);
  const setFavoriteShows = useShowStore((s) => s.setFavoriteShows);
  const favorites = useUserStore((s) => s.userData.favorites);

  const [errMsg, setErrMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  async function getFavorites() {
    try {
      const response = await api.get("shows/favorites");
      setFavoriteShows(response.data.showsData);
      setErrMsg(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrMsg(error.response.data.message ?? error.message);
      } else {
        setErrMsg("Unexpected error!");
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    getFavorites();
  }, [favorites]);

  if (userLoading || loading)
    return (
      <div className="w-full h-[80vh] grid place-items-center">Loading..</div>
    );

  if (!isUser) return <Navigate to="/" />;

  return (
    <>
      {!errMsg && (!favoriteShows || favoriteShows.length === 0) ? (
        <div className="w-full h-[80vh] grid place-items-center">
          You don't have any favorites yet!
        </div>
      ) : (
        <div>
          {errMsg && (
            <h2 className="text-2xl text-center p-4">
              {" "}
              faild to update favorites {errMsg}{" "}
            </h2>
          )}
          <div className="flex flex-wrap gap-8 p-6 justify-center mt-12  ">
            {favoriteShows.map((favorite) => (
              <ShowCard key={favorite._id} show={favorite} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Favorites;
