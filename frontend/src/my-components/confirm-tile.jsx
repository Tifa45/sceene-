import { useState } from "react";


function ConfirmTile({ handleCloseModal, action, title, btnTxt }) {
  const [disabled, setDisabled] = useState(false);
  async function handleAction() {
    setDisabled(true);
    await action();
    setDisabled(false);
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <h2 className="text-2xl">{title}</h2>
      <p>You will not be able to undo this</p>
      <div className="flex justify-end gap-4 items-center">
        <button
          type="button"
          disabled={disabled}
          onClick={handleCloseModal}
          className={`bg-gray-500 p-2 rounded-lg hover:brightness-120 text-black disabled:bg-white disabled:cursor-pointer!`}
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={handleAction}
          className={`bg-hover p-2 rounded-lg hover:brightness-120 disabled:bg-white disabled:text-black disabled:cursor-pointer!`}
        >
          {btnTxt}
        </button>
      </div>
    </div>
  );
}

export default ConfirmTile;
