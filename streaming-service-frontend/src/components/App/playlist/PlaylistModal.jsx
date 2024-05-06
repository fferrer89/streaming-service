"use client";

import React, { useState } from "react";
export const PlayListModal = ({ modalId, Icon, CustomForm, FormData }) => {
  const [onSubmitMessage, setOnSubmitMessage] = useState("");
  return (
    <>
      {modalId && (
        <div className="flex">
          <button onClick={() => document.getElementById(modalId).showModal()}>
            <Icon />
          </button>

          <dialog id={modalId} style={{ backgroundColor: "white" }}>
            <div>
              <form method="dialog">
                <div
                  className="flex"
                  style={{
                    justifyContent: "end",
                    marginTop: "2rem",
                    marginRight: "3rem",
                  }}
                >
                  <button className="" onClick={() => setOnSubmitMessage("")}>
                    ✕
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
            </div>
          </dialog>
        </div>
      )}
    </>
  );
};
