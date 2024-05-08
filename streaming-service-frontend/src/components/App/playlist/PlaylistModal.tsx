// PlayListModal.tsx
"use client";
import React, { useState, useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";

interface PlayListModalProps {
  modalId: string;
  CustomForm: React.FC<{
    data: any;
    onSubmitMessage: string;
    setOnSubmitMessage: React.Dispatch<React.SetStateAction<string>>;
  }>;
  FormData: any;
  isOpen: boolean;
  onClose: () => void;
}

export const PlayListModal: React.FC<PlayListModalProps> = ({
  modalId,
  CustomForm,
  FormData,
  isOpen,
  onClose,
}) => {
  const [onSubmitMessage, setOnSubmitMessage] = useState("");

  useEffect(() => {
    const dialog = document.getElementById(modalId) as HTMLDialogElement;
    if (dialog) {
      if (isOpen) {
        dialog.showModal();
      } else {
        dialog.close();
      }
    }
  }, [isOpen, modalId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <dialog
          id={modalId}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-15 w-screen h-screen z-50"
          style={{
            backdropFilter: "blur(5px)",
            border: "none",
            padding: "0",
            margin: "auto",
          }}
        >
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-lg"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <form method="dialog">
              <div className="flex justify-end mb-4">
                <button
                  className="bg-gray-100 p-2 rounded-full shadow"
                  onClick={onClose}
                >
                  <RxCross1 size={"18px"} />
                </button>
              </div>
            </form>
            <div>
              <CustomForm
                data={FormData}
                onSubmitMessage={onSubmitMessage}
                setOnSubmitMessage={setOnSubmitMessage}
              />
            </div>
          </motion.div>
        </dialog>
      )}
    </AnimatePresence>
  );
};

export default PlayListModal;
