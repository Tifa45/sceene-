import { useState } from "react";
import useClickOutSide from "../hooks/useClickOutSide";

function ConfirmDeleteComment({ action, switchState }) {
  const [disabled, setDisabled] = useState(false);
  const nodeRef = useClickOutSide(() => switchState(false));
  async function handleAction() {
    setDisabled(true);
    await action();
    setDisabled(false);
  }
  return (
    <div ref={nodeRef} className="w-full  ">
      <div className="rounded-lg border-4 border-blue-500 bg-gray-200 text-black text-center p-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-4">Delete comment ?</h2>
          <p>You will not be able to undo this</p>
        </div>
        <div className="flex w-full gap-4 items-center justify-center">
          <button
            disabled={disabled}
            type="button"
            onClick={() => switchState(false)}
            className="p-4 rounded-lg bg-blue-400 disabled:bg-gray-300 disabled:cursor-default!"
          >
            Cancel
          </button>
          <button
            disabled={disabled}
            type="button"
            onClick={handleAction}
            className="p-4 rounded-lg bg-red-400 disabled:bg-gray-300 disabled:cursor-default!"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteComment;
