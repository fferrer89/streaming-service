//@ts-nocheck
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { updateSong, deleteSong } from "@/app/actions";
import { isoToUsDateFormat } from "@/utils/helpers";
import SongFormModal from "@/components/App/Artist/SongFormModal";
import { useFormState } from "react-dom";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
const initialState = {
  message: null,
};
const SongDetails: React.FC<{ songData: any; refetch: any }> = ({
  songData,
  refetch,
}) => {
  const artistId = useSelector(
    (state: { user: { userId: string | null } }) => state.user.userId
  );
  const token = useSelector(
    (state: { user: { token: string | null } }) => state.user.token
  );
  const {
    _id,
    album,
    artists,
    cover_image_url,
    duration,
    genre,
    language,
    likes,
    lyrics,
    producers,
    release_date,
    song_url,
    title,
    writtenBy,
  } = songData?.getSongById;
  let data;
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorMessages, setErrorMessages] = useState(null);
  const [showSongModal, setShowSongModal] = useState(false);
  // @ts-ignore
  const [updateSongFormState, updateSongFormAction] = useFormState(
    (state, payload) =>
      updateSong(state, payload, token, cover_image_url, song_url),
    initialState
  );
  const cancelRemoveSong = () => {
    setShowConfirmation(false);
  };
  const router = useRouter();
  const confirmRemoveSong = async () => {
    data = await deleteSong(_id, token);
    if (data?.errorMessages?.length > 0) {
      setErrorMessages(data?.errorMessages);
    } else {
      setShowConfirmation(false);

      router.push("/artist/songs");
      refetch();
      //window.location.href = "/artist/songs";
    }
  };
  const imageUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${cover_image_url}`;
  return (
    <div
      className="flex flex-col w-full h-fit gap-3 p-0 bg-white rounded-lg overflow-hidden items-center relative"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
    >
      <div className="inline-flex flex-auto items-center relative w-full px-5 pt-3">
        <div className="relative w-auto mt-0 font-mono font-medium text-white text-lg text-center tracking-normal">
          Song Details
        </div>
        <button
          onClick={() => setShowConfirmation(true)}
          className="bg-stone-300 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow ml-8"
        >
          Delete This Song
        </button>
        {showSongModal && (
          <SongFormModal
            method="patch"
            actionData={updateSongFormState}
            action={updateSongFormAction}
            songData={songData?.getSongById}
            setShowModal={setShowSongModal}
            artistId={artistId}
            refetch={refetch}
          />
        )}
        <button
          onClick={() => setShowSongModal(true)}
          className="bg-stone-300 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
        >
          Edit This Song
        </button>
      </div>

      <Separator className="w-[95%]" />

      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-200 p-4 rounded-lg shadow-lg text-black">
            {/*// Error form dialog*/}
            {errorMessages && errorMessages?.length > 0 && (
              <div
                className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
                role="alert"
              >
                {errorMessages?.map((msg, index) => {
                  return (
                    <p className="error" key={index}>
                      {msg}
                    </p>
                  );
                })}
              </div>
            )}
            <p>Are you sure you want to remove this Song?</p>
            <div className="mt-4 flex justify-end">
              {/* {error && <div>{error}</div>} */}
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md mr-2 hover:bg-red-600"
                onClick={confirmRemoveSong}
              >
                Confirm
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                onClick={cancelRemoveSong}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full py-5 px-3 overflow-x-auto flex flex-row items-start">
        <div className="ml-4 flex flex-col justify-start">
          <img className="w-full max-w-md" src={imageUrl} alt={title} />
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-sm text-gray-600 mb-2">Album: {album?.title}</p>
            <p className="text-sm text-gray-600 mb-2">
              Artists:{" "}
              {artists.map((artist: any) => artist.display_name).join(", ")}
            </p>
            <p className="text-sm text-gray-600 mb-2">Duration: {duration}</p>
            <p className="text-sm text-gray-600 mb-2">Genre: {genre}</p>
            <p className="text-sm text-gray-600 mb-2">
              Language: {language ? language : "English"}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Likes: {likes ? likes : 0}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Producers: {producers.join(", ")}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Release Date:{" "}
              {isoToUsDateFormat(
                release_date?.substring(0, 10),
                "release_date"
              )}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Written By: {writtenBy}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongDetails;
