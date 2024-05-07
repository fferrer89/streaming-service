"use client";

import { useMutation } from "@apollo/client";
import React from "react";
import { client } from "../../../utils/playlistHelper";
import queries from "../../../utils/queries";
import { PlayListForm } from "./PlaylistForm";
import { PlayListModal } from "./PlaylistModal";
import { FaPlus } from "react-icons/fa6";

const AddPlayListForm = ({ onSubmitMessage, setOnSubmitMessage, data }) => {
  const [createPlayList, { data: createData, loading, error }] = useMutation(
    queries.CREATE_PLAYLIST,
    {
      refetchQueries: [queries.GET_PLAYLIST],
      client,
      onCompleted: () => {
        setOnSubmitMessage("Successfully Created");
      },
    }
  );

  return (
    <PlayListForm
      data={data}
      error={error}
      mutation={createPlayList}
      formTitle="Create Playlist"
      buttonName="Create"
      onSubmitMessage={onSubmitMessage}
      setOnSubmitMessage={setOnSubmitMessage}
    />
  );
};

export const AddPlaylistModal = () => {
  return (
    <PlayListModal
      CustomForm={AddPlayListForm}
      Icon={FaPlus}
      modalId={`CreatePlaylist`}
      FormData={{ title: "", description: "", visibility: "PRIVATE" }}
    />
  );
};
