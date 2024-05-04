'use client'
import {useQuery} from "@apollo/client";
import queries from "../../../utils/queries";
import Image from "next/image";
import React, {useState} from "react";
import AlbumFormDialog from '../../../components/App/album/album-form-dialog'
import {useFormState as useFormState} from 'react-dom';
import {createAlbum, deleteAlbum} from "../../actions";

const initialState = {
    message: null
};
export default function Artist({params}) {
    const [showAddFormDialog, setShowAddFormDialog] = useState(false);
    const { data:artistAlbums, loading, error } = useQuery(queries.GET_ALBUMS_BY_ARTIST,
        {variables: { artistId: params.id }});
    const [createAlbumFormState, createAlbumFormAction] = useFormState(createAlbum, initialState);
    const [deleteAlbumFormState, deleteAlbumFormAction] = useFormState(deleteAlbum, initialState);
    return (
        <section id='artist-home'>
            <section id='albums'>
                <button className='add-element-btn'
                        onClick={() => {
                            setShowAddFormDialog(showAddFormDialog => !showAddFormDialog);
                        }}>
                    Create Album
                </button>
                {showAddFormDialog && (
                    <AlbumFormDialog
                        artistId={params.id}
                        createAlbumFormState={createAlbumFormState}
                        createAlbumFormAction={createAlbumFormAction}
                        setShowAddFormDialog={setShowAddFormDialog}
                        showAddFormDialog={showAddFormDialog}
                    />)
                }
                {artistAlbums?.getAlbumsByArtist?.map(album => (
                    <article key={album?._id}>
                        <hr/>
                        <form action={deleteAlbumFormAction} id='form-delete-album'>
                            <ul>
                                <li>
                                    <input aria-label='Album Id' type='text' id='albumId' name='albumId' hidden
                                           defaultValue={album?._id}/>
                                </li>
                                <li>
                                    <input aria-label='Artist Id' type='text' id='artistId' name='artistId' hidden
                                           defaultValue={params.id}/>
                                </li>
                                {deleteAlbumFormState?.errorMessages?.map((msg, index) => {
                                    return (
                                        <li className='error' key={index}>
                                            {msg}
                                        </li>
                                    );
                                })}
                            </ul>
                            <button type="submit" value='delete'>
                                Delete
                            </button>
                        </form>
                        <Image
                            // src={album?.cover_image_url ?? '/img/placeholder-album.png'}
                            src='/img/placeholder-album.png'
                            width={35}
                            height={35}
                            alt={album?.title ?? 'Placeholder for an album coverage image'}
                                // className={styles.albumImg}
                            />
                            <dl>
                                <dt>Title</dt>
                                <dd>{album?.title}</dd>
                                <dt>Album Type</dt>
                                <dd>{album?.album_type}</dd>
                                <dt>Release date</dt>
                                <dd>
                                    <time dateTime={album?.release_date}>{album?.release_date}</time>
                                </dd>
                            </dl>
                    </article>
                    ))}
                {createAlbumFormState?.album &&
                    <article key={createAlbumFormState?.album?._id}>
                        <hr/>
                        <form action={deleteAlbumFormAction} id='form-delete-album'>
                            <ul>
                                <li>
                                    <input aria-label='Album Id' type='text' id='albumId' name='albumId' hidden
                                           defaultValue={createAlbumFormState?.album?._id}/>
                                </li>
                                <li>
                                    <input aria-label='Artist Id' type='text' id='artistId' name='artistId' hidden
                                           defaultValue={params.id}/>
                                </li>
                                {deleteAlbumFormState?.errorMessages?.map((msg, index) => {
                                    return (
                                        <li className='error' key={index}>
                                            {msg}
                                        </li>
                                    );
                                })}
                            </ul>
                            <button type="submit" value='delete'>
                                Delete
                            </button>
                        </form>
                        <Image
                            // src={album?.cover_image_url ?? '/img/placeholder-album.png'}
                            src='/img/placeholder-album.png'
                            width={35}
                            height={35}
                            alt={createAlbumFormState?.album?.title ?? 'Placeholder for an album coverage image'}
                            // className={styles.albumImg}
                        />
                        <dl>
                            <dt>Title</dt>
                            <dd>{createAlbumFormState?.album?.title}</dd>
                            <dt>Album Type</dt>
                            <dd>{createAlbumFormState?.album?.album_type}</dd>
                            <dt>Release date</dt>
                            <dd>
                                <time
                                    dateTime={createAlbumFormState?.album?.release_date}>{createAlbumFormState?.album?.release_date}</time>
                            </dd>
                        </dl>
                    </article>
                }
            </section>
        </section>
    );
};
