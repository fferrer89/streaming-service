"use client";

import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import apolloClient from "@/utils";
import queries from "../../../utils/queries";
import { PlayListForm } from "./PlaylistForm";
import { PlayListModal } from "./PlaylistModal";
import { FaPencil } from "react-icons/fa6";

const EditPlayListForm = ({ data, onSubmitMessage, setOnSubmitMessage }) => {
  const [editPlayList, { data: editData, loading, error }] = useMutation(
    queries.EDIT_PLAYLIST,
    {
      refetchQueries: [queries.GET_PLAYLIST],
      apolloClient ,
      onCompleted: () => {
        setOnSubmitMessage("Successfully Updated");
      },
    }
  );

  return (
    <PlayListForm
      data={data}
      error={error}
      mutation={editPlayList}
      formTitle="Edit Playlist"
      buttonName="Update"
      onSubmitMessage={onSubmitMessage}
      setOnSubmitMessage={setOnSubmitMessage}
    />
  );
};

export const EditPlaylistModal = ({ data }) => {
  return (
    <PlayListModal
      CustomForm={EditPlayListForm}
      Icon={FaPencil}
      modalId={`edit-${data._id}`}
      FormData={data}
    />
  );
};
