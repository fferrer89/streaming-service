'use client'
import {useQuery} from "@apollo/client";
import queries from "../../../utils/queries";
import Image from "next/image";
import React, {useState} from "react";
import AlbumFormDialog from '../../../components/App/album/album-form-dialog'
import {useFormState as useFormState} from 'react-dom';
import {createAlbum} from "../../actions";

const initialState = {
    message: null
};
export default function Artist({params}) {
    const [showAddFormDialog, setShowAddFormDialog] = useState(false);
    const { data:artistAlbums, loading, error } = useQuery(queries.GET_ALBUMS_BY_ARTIST,
        {variables: { artistId: params.id }});
    const [formState, formAction] = useFormState(createAlbum, initialState);

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
                        formState={formState}
                        formAction={formAction}
                        setShowAddFormDialog={setShowAddFormDialog}
                        showAddFormDialog={showAddFormDialog}
                    />)
                }
                {artistAlbums?.getAlbumsByArtist?.map(album => (
                    <article key={album?._id}>
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
                {formState?.album &&
                    <article key={formState?.album?._id}>
                        <Image
                            // src={album?.cover_image_url ?? '/img/placeholder-album.png'}
                            src='/img/placeholder-album.png'
                            width={35}
                            height={35}
                            alt={formState?.album?.title ?? 'Placeholder for an album coverage image'}
                            // className={styles.albumImg}
                        />
                        <dl>
                            <dt>Title</dt>
                            <dd>{formState?.album?.title}</dd>
                            <dt>Album Type</dt>
                            <dd>{formState?.album?.album_type}</dd>
                            <dt>Release date</dt>
                            <dd>
                                <time dateTime={formState?.album?.release_date}>{formState?.album?.release_date}</time>
                            </dd>
                        </dl>
                    </article>
                }
            </section>
        </section>
    );
};
