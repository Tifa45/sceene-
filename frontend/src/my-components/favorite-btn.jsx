import { HeartPlus } from "lucide-react";
import { useState } from "react";
import { useUserStore } from "../stores/user-store";
import axios from "axios";
import api from "../lib/axios-utils";
import { toast } from "sonner";

function FavoritBtn({ showId, styles }) {
  const userId = useUserStore((s) => s.userData.userId);
  const userFavorites = useUserStore((s) => s.userData.favorites);
  const setFavorite = useUserStore((s) => s.setFavorite);
  const isFavorites = userFavorites.includes(showId);

  const [disabled, setDisabled] = useState(false);

  async function toggleFavorite() {
    setDisabled(true);
    if (!userId) {
      toast.info("Login to add favorites");
      setDisabled(false);
      return;
    }

    try {
      const adding = api.patch("/users/favorite", { showId });

      toast.promise(adding, {
        loading: "Adding",
        success: (data) => {
          const status = data.data.isFavorite ? "Added" : "Removed";
          return status;
        },
        error: (error) => error.response.data.message || error.message,
      });
      await adding;
      setFavorite(showId);
    } catch (error) {
      console.log(error);
    }
    setDisabled(false);
  }

  return (
    <button
      type="button"
      disabled={disabled}
      className={styles}
      onClick={toggleFavorite}
    >
      <span>Favorite</span>
      <HeartPlus className={` inline ${isFavorites && "fill-red-500"} `} />
    </button>
  );
}

export default FavoritBtn;
