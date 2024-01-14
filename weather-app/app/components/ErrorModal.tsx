import React from "react";

interface ErrMsg {
  errMsg: string;
  modalState: boolean;
  handleModal: () => void;
}

const ErrorModal = ({ errMsg, modalState, handleModal }: ErrMsg) => {
  return (
    <div>
      <dialog
        id="my_err_modal_1"
        className={`modal ${modalState ? "modal-open" : "modal-close"}`}
      >
        <div className="modal-box">
          {/* if there is a button in form, it will close the modal */}
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={handleModal}
          >
            ✕
          </button>
          <h3 className="font-bold text-lg">
            Oops The Application Encountered an Error!
          </h3>
          <h2>{errMsg}</h2>
        </div>
      </dialog>
    </div>
  );
};

export default ErrorModal;
