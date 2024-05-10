// PlayListForm.tsx
// @ts-nocheck
"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface PlayListFormProps {
  data: any;
  error: any;
  mutation: (options: any) => void;
  formTitle: string;
  buttonName: string;
  onSubmitMessage: string;
  setOnSubmitMessage: React.Dispatch<React.SetStateAction<string>>;
}

export const PlayListForm: React.FC<PlayListFormProps> = ({
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

  const formSubmit = async (formData: any) => {
    // console.log(formData);
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
    <div className="flex flex-col justify-center items-center min-w-[400px] pb-16">
      <h2 className="text-2xl font-semibold mb-6">{formTitle}</h2>
      <form
        onSubmit={handleSubmit(formSubmit)}
        className="flex flex-col w-full max-w-lg gap-4"
      >
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title:
          </label>
          <input
            type="text"
            id="title"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
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
            <p className="text-red-600 mt-2">{errors.title.message as string}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description:
          </label>
          <textarea
            id="description"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
            defaultValue={data.description}
            placeholder="Add description"
            {...register("description", {
              required: "Description is Required",
              validate: {
                justSpaces: (desc) => {
                  if (desc.trim().length == 0) {
                    return "Description can't be empty spaces";
                  }
                },
              },
            })}
          />
          {errors && errors.description && (
            <p className="text-red-600 mt-2">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="visibility"
            className="block text-sm font-medium text-gray-700"
          >
            Visibility:
          </label>
          <select
            id="visibility"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
            {...register("visibility", {
              required: "Visibility is Required",
            })}
            defaultValue={data.visibility}
          >
            {visibilityOptions &&
              visibilityOptions.map((visibility, index) => {
                return (
                  <option key={index} value={visibility}>
                    {visibility}
                  </option>
                );
              })}
          </select>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {buttonName}
          </button>
        </div>
      </form>
      {onSubmitMessage && (
        <p className="mt-4 text-green-600">{onSubmitMessage}</p>
      )}
    </div>
  );
};
