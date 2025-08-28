import { useEffect, useState } from "react";
import AddShowForm from "./add-show-form";
import axios from "axios";
import { Plus } from "lucide-react";
import api from "../lib/axios-utils";
import { toast } from "sonner";

function AddShows() {
  const [showsToAdd, setShowsToAdd] = useState([]);
  const [formsCount, setFormsCount] = useState(0);

  async function postShows() {
    if (!showsToAdd || showsToAdd.length === 0) {
      return;
    }

    const body = showsToAdd.map(({ tempId, ...rest }) => ({ ...rest }));

    try {
      const request = api.post("/shows/add", { showsToAdd: body });
      toast.promise(request, {
        loading: "Posting",
        success: (res) => `${res.data.message}, ${res.data.results}`,
        error: (err) => {
          const msg = err.response.data.message
            ? `${err.response.data.message}, ${err.response.data?.results}`
            : "Unexpected error!";
          return msg;
        },
      });
      await request;
      setFormsCount(0);
      setShowsToAdd([]);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    return () => {
      navigator.sendBeacon("http://localhost:5000/api/shows/clean-img");
    };
  }, []);

  return (
    <div className="w-full h-full overflow-hidden  flex flex-col gap-4 pb-20  ">
      <div className="flex gap-4 bg-secondary p-2 border rounded-md">
        <button
          type="button"
          onClick={() => setFormsCount((count) => count + 1)}
        >
          <Plus />
        </button>
        <button
          type="button"
          disabled={showsToAdd.length === 0}
          className="submit-btn"
          onClick={postShows}
        >
          Post
        </button>
      </div>

      <div className="space-y-4 h-full overflow-y-scroll [&::-webkit-scrollbar]:w-2  [&::-webkit-scrollbar-thumb]:bg-gray-500/50 [&::-webkit-scrollbar-thumb]:rounded-md">
        {formsCount > 0 &&
          Array(formsCount)
            .fill()
            .map((form, index) => (
              <AddShowForm
                key={index}
                showsToAdd={showsToAdd}
                setShowsToAdd={setShowsToAdd}
                setFormsCount={setFormsCount}
              />
            ))}
      </div>
    </div>
  );
}

export default AddShows;
