import React, {useEffect, useRef, useState} from "react";
import {MusicGenres} from "@/utils/helpers";
import {useQuery} from "@apollo/client";
import queries from "@/utils/queries";

export default function SongFormModal({method, actionData, action, songData, setShowModal, artistId, refetch}) {
    const hasPageBeenRendered = useRef(false);
    const formElement = useRef();
    const [addModalStatus, setAddModalStatus] = useState('open');
    const {
        data: artistAlbums,
    } = useQuery(queries.GET_ALBUMS_BY_ARTIST, {
        variables: {artistId: artistId},
    });

    const updateAddModalStatus = () => {
        if (addModalStatus === 'open') {
            // Closing the modal
            formElement.current.reset();
            delete actionData?.errorMessages;
            setAddModalStatus('');
            setShowModal(false);
        } else {
            // Opening the modal
            setAddModalStatus('open');
        }
    }
    useEffect(() => {
        if (hasPageBeenRendered.current) {
            if (actionData?.errorMessages?.length > 0) {
                setAddModalStatus('open');
            } else if (actionData?.song?._id) {
                formElement.current.reset();
                setAddModalStatus('');
                setShowModal(false);
                refetch()
            }
        }
        delete actionData?.song;
        hasPageBeenRendered.current = true;
    }, [actionData?.errorMessages?.length, actionData?.song?._id]);
    return (
        <div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <form action={action} ref={formElement} id='dialog-form-song'
                  className="relative bg-stone-400 rounded-lg shadow-md w-6/12 p-4 overflow-y-auto h-4/5">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">New Song Details</h2>
                </div>
                {actionData && actionData?.errorMessages && (
                    <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                        {actionData?.errorMessages?.map((msg, index) => {
                            return (
                                <p className="error" key={index}>
                                    {msg}
                                </p>
                            );
                        })}
                    </div>
                )}
                {/*Hidden fields*/}
                <input aria-label='Artist Id' type='text' id='artistId' name='artistId' hidden
                       defaultValue={artistId}/>
                <input aria-label='Song Id' type='text' id='songId' name='songId' hidden
                       defaultValue={songData?._id}/>

                <div className="p-1 text-black overflow-y-auto h-6/12">
                    {/* Song form fields */}
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">
                            Title
                        </label>
                        <input type="text" id="title" name="title" required={method === 'post'}
                               defaultValue={songData?.title}
                               className="border border-gray-300 rounded-md p-2 w-full"/>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="release_date" className="block text-gray-700 font-semibold mb-2">
                            Release Date
                        </label>
                        <input type="date" id="release_date" name="release_date" required={method === 'post'}
                               defaultValue={songData?.release_date.substring(0, 10)}
                               max={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]}
                               className="border border-gray-300 rounded-md p-2 w-full"/>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="duration" className="block text-gray-700 font-semibold mb-2">
                            Song Duration
                        </label>
                        <input type="number" id="duration" name="duration" defaultValue={songData?.duration}
                               className="border border-gray-300 rounded-md p-2 w-full"/>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="genre" className="block text-gray-700 font-semibold mb-2">
                            Genre
                        </label>
                        <select name='genre' id='genre' form='dialog-form-song' required={method === 'post'}
                                className="border border-gray-300 rounded-md p-2 w-full">
                            {songData?.genre ?
                                (
                                    <>
                                        {MusicGenres
                                            .map((genre) => {
                                                if (songData?.genre?.includes(genre)) {
                                                    return <option key={genre} selected value={genre}>{genre}</option>
                                                } else {
                                                    return <option key={genre} value={genre}>{genre}</option>
                                                }
                                            })
                                        }
                                    </>
                                ) :
                                (
                                    <>
                                        <option key='default-genre-msg' value=""
                                                defaultValue='--Please choose a genre--'>
                                            --Please choose a genre--
                                        </option>
                                        {MusicGenres.map((genre) => {
                                            return (<option key={genre} value={genre}>{genre}</option>)
                                        })}
                                    </>
                                )
                            }
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="writtenBy" className="block text-gray-700 font-semibold mb-2">
                            Written By Name
                        </label>
                        <input type="text" id="writtenBy" name="writtenBy" required={method === 'post'}
                               defaultValue={songData?.writtenBy}
                               className="border border-gray-300 rounded-md p-2 w-full"/>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="producers" className="block text-gray-700 font-semibold mb-2">
                            Producers (separated by colon)
                        </label>
                        <input type="text" id="producers" name="producers" required={method === 'post'}
                               defaultValue={songData?.producers?.join('; ')}
                               placeholder="e.g. Universal; Epic Records"
                               className="border border-gray-300 rounded-md p-2 w-full"/>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="album" className="block text-gray-700 font-semibold mb-2">
                            Album
                        </label>
                        <select name='album' id='album' form='dialog-form-song'
                                className="border border-gray-300 rounded-md p-2 w-full">
                            {songData?.album?._id ?
                                (
                                    <>
                                        {artistAlbums?.getAlbumsByArtist?.map((album) => {
                                            if (album?._id === songData?.album?._id) {
                                                return (<option key={album?._id} selected
                                                                value={album?._id}>{album?.title}</option>)
                                            } else {
                                                return (
                                                    <option key={album?._id} value={album?._id}>{album?.title}</option>)
                                            }
                                        })
                                        }
                                    </>
                                ) :
                                (
                                    <>
                                        <option key='default-album-msg' value=""
                                                defaultValue='--Please choose an album--'>
                                            --Please choose an album--
                                        </option>
                                        {artistAlbums?.getAlbumsByArtist?.map((album) => {
                                            return (<option key={album?._id} value={album?._id}>{album?.title}</option>)
                                        })}
                                    </>
                                )
                            }
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="cover_image_url" className="block text-gray-700 font-semibold mb-2">
                            Cover Image Upload
                        </label>
                        <input type="file" id="cover_image_url" name="cover_image_url" required={method === 'post'}
                               accept='image/*'
                               className="border border-gray-300 rounded-md p-2 w-full"/>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="song_url" className="block text-gray-700 font-semibold mb-2">
                            Song Upload
                        </label>
                        <input type="file" id="song_url" name="song_url" required={method === 'post'}
                               accept='audio/*'
                               className="border border-gray-300 rounded-md p-2 w-full"/>
                    </div>

                    <button type="submit" value='submit'
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none mr-2">
                        {method === 'post' ? 'Submit' : 'Save'}
                    </button>
                    <button value='close'
                            onClick={(event) => {
                                event.preventDefault();
                                setAddModalStatus('');
                                updateAddModalStatus();
                                refetch()
                            }}
                            className="text-gray-600 hover:text-gray-800 focus:outline-none">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}