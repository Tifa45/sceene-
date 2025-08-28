import { useState } from "react";
import useClickOutSide from "../hooks/useClickOutSide";
import { EllipsisVertical } from "lucide-react";

function CommentOptions({ func1, func2 }) {
  const [options, setOptions] = useState(false);
  const nodeRef = useClickOutSide(() => setOptions(false));

  return (
    <div ref={nodeRef} className="relative z-9">
      <button type="button" onClick={() => setOptions(!options)}>
        <EllipsisVertical />
      </button>
      {options && (
        <div className="absolute top-[2rem] right-0 rounded-md py-4 w-40 bg-secondary">
          <div className="px-4 pb-2 mb-2 border-b-1 border-gray-400 hover:text-white ">
            <button type="button" onClick={() => {func1(true); setOptions(false)}}>
              Edit
            </button>
          </div>
          <div className="px-4 hover:text-white">
            <button type="button" onClick={() =>{ func2(true); setOptions(false)}}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommentOptions;
