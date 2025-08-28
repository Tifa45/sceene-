import axios from "axios";
import { Star } from "lucide-react";
import { useState } from "react";
import api from "../lib/axios-utils";
import { useUserStore } from "../stores/user-store";
import { toast } from "sonner";

function RatingTile({
  showName,
  showId,
  userRate,
  setCurrentUserRate,
  handleCloseModal,
}) {
  const stars = Array(5).fill(null);
  const [currentRate, setCurrentRate] = useState(userRate || 0);
  const [tempRate, setTempRate] = useState(userRate || 0);

  const [isDisabled, setIsDisabled] = useState(false);

  async function handleRateShow(rateValue) {
    setIsDisabled(true);
    const body = {
      ratedShowId: showId,
      rateValue,
    };

    try {
      const request = api.patch("/shows/rate", body);
      toast.promise(request, {
        loading: "Submiting",
        success: (res) => {
          const msg = res.data.rateValue > 0 ? "Submitted" : "Removed";
          return msg;
        },
        error: (err) => err.response.data.message || err.message,
      });

      const response = await request;
      setCurrentUserRate(
        response.data.rateValue > 0 ? response.data.rateValue : null
      );

      handleCloseModal();
    } catch (error) {
      console.log(error);
    }
    setIsDisabled(false);
  }

  return (
    <>
      <h2 className="text-2xl">Rate {showName} </h2>
      <div className="flex">
        {stars.map((star, index) => {
          const hoverRate = index + 1;
          return (
            <button
              key={index}
              type="button"
              disabled={isDisabled}
              onMouseEnter={() => setTempRate(hoverRate)}
              onMouseLeave={() => setTempRate(currentRate)}
              onClick={() => setCurrentRate(hoverRate)}
            >
              <Star
                className={`${hoverRate <= tempRate && "fill-amber-400"}`}
              />
            </button>
          );
        })}
      </div>
      <div className="flex w-full justify-center items-center gap-4 ">
        <button
          type="button"
          disabled={isDisabled}
          onClick={() => handleRateShow(currentRate)}
          className={`${isDisabled && "disabled-txt"}`}
        >
          Submit
        </button>
        {userRate && (
          <button
            type="button"
            disabled={isDisabled}
            onClick={() => handleRateShow(0)}
            className={`${isDisabled && "disabled-txt"}`}
          >
            Remove Your Rate
          </button>
        )}
      </div>
    </>
  );
}

export default RatingTile;
