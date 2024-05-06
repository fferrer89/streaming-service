import {useEffect, useRef, useState} from "react";
import {AlbumTypes, MusicGenres, Visibilities} from "../../utils/helpers";

export default function AlbumFormDialog({method, actionData, action,
                                            setShowFormDialog, albumData, artistId, refetch}) {
    // Add & Edit Modal Hooks
    const hasPageBeenRendered = useRef(false);
    const formElement = useRef();
    const [addModalStatus, setAddModalStatus] = useState('open');

    const updateAddModalStatus = () => {
        if (addModalStatus === 'open') {
            // Closing the modal
            formElement.current.reset();
            delete actionData?.errorMessages;
            setAddModalStatus('');
            setShowFormDialog(false);
        } else {
            // Opening the modal
            setAddModalStatus('open');
        }
    }
    useEffect(() => {
        if (hasPageBeenRendered.current) {
            if (actionData?.errorMessages?.length > 0) {
                setAddModalStatus('open');
            } else if (actionData?.album?._id) {
                formElement.current.reset();
                setAddModalStatus('');
                setShowFormDialog(false);
                refetch()
            }
        }
        delete actionData?.album;
        hasPageBeenRendered.current = true;
    }, [actionData?.errorMessages?.length, actionData?.album?._id]);
    return (
        <>
            <dialog open={addModalStatus === 'open'}>
                <form action={action} id='dialog-form-album' ref={formElement}>
                    <button className='close-modal'
                            value='close'
                            onClick={(event) => {
                                event.preventDefault();
                                setAddModalStatus('');
                                updateAddModalStatus();
                                refetch()
                            }}
                    >
                        X
                    </button>
                    <ul>
                        <li>
                            <input aria-label='Artist Id' type='text' id='artistId' name='artistId' hidden
                                   defaultValue={artistId}/>
                        </li>
                        <li>
                            <input aria-label='Album Id' type='text' id='albumId' name='albumId' hidden
                                   defaultValue={albumData?.albumId}/>
                        </li>
                        <li>
                            <label>
                                Title:
                                <input type='text' id='title' name='title' placeholder="e.g. Viva la Vida"
                                       defaultValue={albumData?.title}
                                />
                            </label>
                        </li>
                        <li>
                            <label>
                                Release Date:
                                <input type='date' id='release_date' name='release_date'
                                       defaultValue={albumData?.release_date?.slice(0, 10)}
                                />
                            </label>
                        </li>
                        <li>
                            <label>
                                Album Type:
                                <select name='album_type' id='album_type' form='dialog-form-album'>
                                    {albumData?.album_type ?
                                        (
                                            <>
                                                <option key={albumData?.album_type} value={albumData?.album_type}
                                                        defaultValue={albumData?.album_type}>
                                                    {albumData?.album_type}
                                                </option>
                                                {AlbumTypes
                                                    .filter((albumType) => albumType !== albumData?.album_type)
                                                    .map((albumType) => (
                                                        <option key={albumType} value={albumType}>{albumType}</option>))
                                                }
                                            </>
                                        ) :
                                        (
                                            <>
                                                <option key='default-album_type-msg' value=""
                                                        defaultValue='--Please choose an album type--'>
                                                    --Please choose an album type--
                                                </option>
                                                {AlbumTypes.map((album_type) => {
                                                    return (<option key={album_type}
                                                                    value={album_type}>{album_type}</option>)
                                                })}
                                            </>
                                        )
                                    }
                                </select>
                            </label>
                        </li>
                        <li>
                            <label>
                                Description:
                                <input type='text' id='description' name='description'
                                       defaultValue={albumData?.description}/>
                            </label>
                        </li>
                        <li>
                            <label>
                                Genres:
                                <select name='genres' id='genres' form='dialog-form-album' multiple>
                                    {albumData?.genres ?
                                        (
                                            <>
                                                {MusicGenres
                                                    .map((genre) => {
                                                        if (albumData?.genres?.includes(genre)) {
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
                                                    return (<option key={genre}
                                                                    value={genre}>{genre}</option>)
                                                })}
                                            </>
                                        )
                                    }
                                </select>
                            </label>
                        </li>
                        <li>
                            <label>
                                Visibility:
                                <select name='visibility' id='visibility' form='dialog-form-album'>
                                    {albumData?.album_type ?
                                        (
                                            <>
                                                <option key={albumData?.visibility} value={albumData?.visibility}
                                                        defaultValue={albumData?.visibility}>
                                                    {albumData?.visibility}
                                                </option>
                                                {Visibilities
                                                    .filter((visibility) => visibility !== albumData?.visibility)
                                                    .map((visibility) => (
                                                        <option key={visibility}
                                                                value={visibility}>{visibility}</option>))
                                                }
                                            </>
                                        ) :
                                        (
                                            <>
                                                <option key='default-visibility-msg' value=""
                                                        defaultValue='--Please choose a visibility--'>
                                                    --Please choose a visibility--
                                                </option>
                                                {Visibilities.map((visibility) => {
                                                    return (<option key={visibility}
                                                                    value={visibility}>{visibility}</option>)
                                                })}
                                            </>
                                        )
                                    }
                                </select>
                            </label>
                        </li>
                        <li>
                            <label>
                                Cover Image:
                                <input type='file' id='cover_image_url' name='cover_image_url'/>
                            </label>
                        </li>
                    </ul>
                    {actionData && actionData?.errorMessages && (
                        <ul>
                            {actionData?.errorMessages?.map((msg, index) => {
                                return (
                                    <li className='error' key={index}>
                                        {msg}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                    <button type="submit" value='submit'>
                        {method === 'post' ? 'Submit' : 'Save'}
                    </button>
                </form>
            </dialog>
        </>

    )
}