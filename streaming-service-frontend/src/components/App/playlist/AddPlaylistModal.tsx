// AddPlaylistModal.tsx
"use client";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import queries from "../../../utils/queries";
import  PlayListForm  from "./PlaylistForm";
import { PlayListModal } from "./PlaylistModal";
import { FaPlus } from "react-icons/fa6";
import createApolloClient from "@/utils";

const AddPlayListForm: React.FC<{
  onSubmitMessage: string;
  setOnSubmitMessage: React.Dispatch<React.SetStateAction<string>>;
  data: any;
}> = ({ onSubmitMessage, setOnSubmitMessage, data }) => {

  const apolloClient = createApolloClient( localStorage.getItem("token")  );
  const [createPlayList, { error }] = useMutation(queries.CREATE_PLAYLIST, {
    refetchQueries: [queries.GET_PLAYLIST],
    client: apolloClient,
    onCompleted: () => {
      setOnSubmitMessage("Successfully Created");
    },
  });

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

export const AddPlaylistModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  return (
    <PlayListModal
      CustomForm={AddPlayListForm}
      modalId={`CreatePlaylist`}
      FormData={{ title: "", description: "", visibility: "PRIVATE" }}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
};



