import React, {useEffect, useRef, useState} from "react";
import {MusicGenres, Visibilities, AlbumTypes} from '../../../utils/helpers'
import {createAlbum} from '../../../app/actions';
import {useFormState as useFormState} from 'react-dom';
// const initialState = {
//     message: null
// };
import {loadErrorMessages, loadDevMessages} from "@apollo/client/dev";

loadDevMessages();
loadErrorMessages();
export default function AlbumFormDialog({artistId, formState, formAction, setShowAddFormDialog, showAddFormDialog}) {
    // const [isModalOpen, setIsModalOpen] = useState(true);
    const hasPageBeenRendered = useRef(false);
    const formElement = useRef();

    return (
        <dialog open={showAddFormDialog}>
            <button className='close-modal'
                    value='close'
                    onClick={(event) => {
                        formElement?.current?.reset();
                        delete formState?.errorMessages;
                        setShowAddFormDialog(false);
                    }}
            >
                X
            </button>
            <form action={formAction} id='dialog-form-album' ref={formElement}>
                <ul>
                    <li>
                        <input aria-label='Artist Id' type='text' id='artistId' name='artistId' hidden
                               defaultValue={artistId}/>
                    </li>
                    <li>
                        <label>
                            Title:
                            <input type='text' id='title' name='title' placeholder="e.g. Viva la Vida"/>
                        </label>
                    </li>
                    <li>
                        <label>
                            Release Date:
                            <input type='date' id='release_date' name='release_date'/>
                        </label>
                    </li>
                    <li>
                        <label>
                            Album Type:
                            <select id="album_type" name="album_type">
                                <option key='default-album_type-msg' value=""
                                        defaultValue='--Please choose an album type--'>
                                    --Please choose an album type--
                                </option>
                                {AlbumTypes.map((album_type) => {
                                    return (<option key={album_type} value={album_type}>{album_type}</option>)
                                })}
                            </select>
                        </label>
                    </li>
                    <li>
                        <label>
                            Description:
                            <input type='text' id='description' name='description'/>
                        </label>
                    </li>
                    <li>
                        <label>
                            Genre:
                            <select id="genres" name="genres">
                                {MusicGenres.map((genre) => {
                                    return (<option key={genre} value={genre}>{genre}</option>)
                                })}
                            </select>
                        </label>
                    </li>
                    <li>
                        <label>
                            Visibility:
                            <select id="visibility" name="visibility">
                                <option key='default-visibility-msg' value=""
                                        defaultValue='--Please choose an album visibility--'>
                                    --Please choose an album visibility--
                                </option>
                                {Visibilities.map((visibility) => {
                                    return (<option key={visibility} value={visibility}>{visibility}</option>)
                                })}
                            </select>
                        </label>
                    </li>
                </ul>
                {formState && formState?.errorMessages && (
                    <ul>
                        {formState?.errorMessages?.map((msg, index) => {
                            return (
                                <li className='error' key={index}>
                                    {msg}
                                </li>
                            );
                        })}
                    </ul>
                )}
                <button type="submit" value='submit'>
                    Create
                </button>
            </form>
        </dialog>
    )
}