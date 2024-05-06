"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

export const PlayListForm = ({
  data,
  error,
  mutation,
  formTitle,
  buttonName,
  onSubmitMessage,
  setOnSubmitMessage,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const visibilityOptions = ["PUBLIC", "PRIVATE"];

  if (error) {
    setOnSubmitMessage(error.message);
  }

  const formSubmit = async (formData) => {
    console.log(formData);
    let playlistId = "";
    if (data._id) {
      playlistId = data._id;
    }
    mutation({
      variables: {
        ...formData,
        playlistId: playlistId,
      },
    });
    reset();
  };

  return (
    <div
      className="flex flex-col justify-center items-center"
      style={{ minWidth: "400px", paddingBottom: "4rem" }}
    >
      <p className="text-lg" style={{ margin: "2rem" }}>
        {formTitle}
      </p>
      <form onSubmit={handleSubmit(formSubmit)} className="flex flex-col">
        <label htmlFor="title">Title: </label>
        <input
          type="text"
          id="title"
          className="border border-gray-300 p-1 rounded"
          defaultValue={data.title}
          placeholder="Add Title"
          {...register("title", {
            required: "Title is Required",
            validate: {
              justSpaces: (title) => {
                if (title.trim().length == 0) {
                  return "Title can't be empty spaces";
                }
              },
            },
          })}
        />
        {errors && errors.title && (
          <p className="text-orange-600">{errors.title.message}</p>
        )}
        <br></br>
        <label htmlFor="description">Description: </label>
        <input
          type="textarea"
          id="description"
          className="border border-gray-300 p-1 rounded"
          defaultValue={data.description}
          placeholder="Add description"
          {...register("description", {
            required: "description is Required",
            validate: {
              justSpaces: (title) => {
                if (title.trim().length == 0) {
                  return "description can't be empty spaces";
                }
              },
            },
          })}
        />
        {errors && errors.description && (
          <p className="text-orange-600">{errors.description.message}</p>
        )}
        <br></br>
        <label htmlFor="visibility">Visibility: </label>
        <select
          className="select select-bordered my-2 py-0 w-full max-w-xs"
          {...register("visibility", {
            required: "description is Required",
          })}
          defaultValue={data.visibility}
          //   onChange={handleVisibilityChange}
          id="visibility"
        >
          {visibilityOptions &&
            visibilityOptions.map((visibility) => {
              return <option value={visibility}>{visibility}</option>;
            })}
          ;
        </select>
        <br />
        <div className="flex fle-row justify-center">
          <button
            className="rounded-md self-center"
            style={{
              backgroundColor: "gray",
              padding: "0.5rem 1rem 0.5rem 1rem",
            }}
            type="submit"
          >
            {buttonName}
          </button>
        </div>
      </form>
      {onSubmitMessage && <p>{onSubmitMessage}</p>}
    </div>
  );
};
