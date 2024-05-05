'use client'
import {useQuery} from "@apollo/client";
import queries from "../../../utils/queries";
import Image from "next/image";
import {useState} from "react";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import {useFormState as useFormState} from 'react-dom';
import {createAlbum, updateAlbum} from "../../actions";
import AddItem from "../../../components/views/add-item";
import AlbumFormDialog from "../../../components/views/album-form-dialog";
import MenuControls from "../../../components/views/lading/menu-controls";

const initialState = {
    message: null
};
export default function Artist({params}) {
    const { data:artistAlbums, loading, error, refetch} = useQuery(queries.GET_ALBUMS_BY_ARTIST,
        {variables: { artistId: params.id }, fetchPolicy: 'network-only'});
    const [createAlbumFormState, createAlbumFormAction] = useFormState(createAlbum, initialState);
    const [updateAlbumFormState, updateAlbumFormAction] = useFormState(updateAlbum, initialState);
    // const [deleteAlbumFormState, deleteAlbumFormAction] = useFormState(deleteAlbum, initialState);

    const [showAddFormDialog, setShowAddFormDialog] = useState(false);
    const [showEditFormDialog, setShowEditFormDialog] = useState(false);
    const [currentArticleId, setCurrentArticleId] = useState(null); // Track article ID
    return (
        <section id='albums'>
            <AddItem itemName='Album'
                     setShowEditFormDialog={setShowEditFormDialog}
                     setShowAddFormDialog={setShowAddFormDialog}/>
            {showAddFormDialog && (<AlbumFormDialog method='post'
                                                    actionData={createAlbumFormState}
                                                    action={createAlbumFormAction}
                                                    artistId={params?.id}
                                                    setShowFormDialog={setShowAddFormDialog}
                                                    refetch={refetch}
            />)}
            <div className='element-list-container'>
                {artistAlbums?.getAlbumsByArtist && artistAlbums?.getAlbumsByArtist?.length > 0 &&
                    (artistAlbums?.getAlbumsByArtist?.map(album => (
                    <article key={album?._id}>
                        {/*Edit modal dialog*/}
                        {showEditFormDialog && currentArticleId === album?._id &&
                            (<AlbumFormDialog method='patch'
                                              actionData={updateAlbumFormState}
                                              action={updateAlbumFormAction}
                                              setShowFormDialog={setShowEditFormDialog}
                                              artistId={params?.id}
                                              albumData={{
                                                  albumId: album?._id,
                                                  title: album?.title,
                                                  release_date: album?.release_date,
                                                  album_type: album?.album_type,
                                                  genre: album?.genres?.[0],
                                                  visibility: album?.visibility,
                                                  description: album?.description
                                              }}
                                              refetch={refetch}
                            />)}

                        {/*MenuControls including the 'Delete' and 'Edit' modal dialogs*/}

                        <MenuControls albumData={{albumId: album?._id}}
                                      setShowAddFormDialog={setShowAddFormDialog}
                                      setShowEditFormDialog={setShowEditFormDialog}
                                      setCurrentArticleId={setCurrentArticleId}
                                      currentArticleId={currentArticleId}
                                      objectId={album?._id}
                                      refetch={refetch}/>
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
                )))}
            </div>
        </section>
    );
}