import React from "react";

const SuccessModal = ({ isSuccess, message, onClose }) => {
  return (
    <div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative bg-stone-400 rounded-lg shadow-md w-fit p-4 overflow-y-auto h-fit">
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            {isSuccess ? "Success!" : "Error!"}
          </h2>
        </div>
        <div className="p-1 text-black overflow-y-auto">
          <p>{message}</p>
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none mt-4"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
