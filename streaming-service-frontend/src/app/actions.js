'use server'; // Server Render Environment
import validation from '../utils/validations';
import queries from "../utils/queries";
import { getClient } from "../utils";
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
export async function createAlbum(prevState, formData) {
    let title, release_date, album_type, description, genres, visibility, artistId, artists;
    let errors = [];
    title = formData.get('title');
    release_date = formData.get('release_date');
    album_type = formData.get('album_type');
    description = formData.get('description');
    genres = formData.get('genres');
    visibility = formData.get('visibility');
    artistId = formData.get('artistId');
    try {
        title = validation.checkString(title, 'title');
    } catch (e) {
        errors.push(e);
    }
    try {
        album_type = validation.checkString(album_type, 'album_type');
    } catch (e) {
        errors.push(e);
    }
    try {
        description = validation.checkString(description, 'description');
    } catch (e) {
        errors.push(e);
    }
    try {
        genres = validation.checkString(genres, 'genres');
        genres = [genres]
    } catch (e) {
        errors.push(e);
    }
    try {
        visibility = validation.checkString(visibility, 'visibility');
    } catch (e) {
        errors.push(e);
    }
    try {
        artistId = validation.checkId(artistId, 'artistId');
        artists = [artistId]
    } catch (e) {
        errors.push(e);
    }

    if (errors.length > 0) {
        return {errorMessages: errors};
    } else {
        try {
            const client = getClient();
            const {data}  = await client.mutate({
                mutation: queries.ADD_ALBUM,
                variables: { title, release_date, album_type, description, genres, visibility, artists },
                // https://www.apollographql.com/docs/react/data/mutations/#updating-local-data
            });
            return {album: data?.addAlbum};
        } catch (e) {
            return {errorMessages: errors};
        }
    }
}
export async function updateAlbum(prevState, formData) {
    let title, release_date, album_type, description, genres, visibility, artistId, artists, albumId;
    let errors = [];
    albumId = formData.get('albumId');
    title = formData.get('title');
    release_date = formData.get('release_date');
    album_type = formData.get('album_type');
    description = formData.get('description');
    genres = formData.get('genres');
    visibility = formData.get('visibility');
    artistId = formData.get('artistId');
    try {
        if (title) {
            title = validation.checkString(title, 'title');
        }
    } catch (e) {
        errors.push(e);
    }
    try {
        if (album_type) {
            album_type = validation.checkString(album_type, 'album_type');
        }
    } catch (e) {
        errors.push(e);
    }
    try {
        if (description) {
            description = validation.checkString(description, 'description');
        }
    } catch (e) {
        errors.push(e);
    }
    try {
        if (genres) {
            genres = validation.checkString(genres, 'genres');
            genres = [genres]
        }
    } catch (e) {
        errors.push(e);
    }
    try {
        if (visibility) {
            visibility = validation.checkString(visibility, 'visibility');
        }

    } catch (e) {
        errors.push(e);
    }
    try {
        artistId = validation.checkId(artistId, 'artistId');
        albumId = validation.checkId(albumId, 'albumId');
        artists = [artistId]
    } catch (e) {
        errors.push(e);
    }

    if (errors.length > 0) {
        return {errorMessages: errors};
    } else {
        try {
            const client = getClient();
            const {data}  = await client.mutate({
                mutation: queries.EDIT_ALBUM,
                variables: {_id:albumId, title, release_date, album_type, description, genres, visibility, artists },
                // https://www.apollographql.com/docs/react/data/mutations/#updating-local-data
            });
            return {album: data?.editAlbum};
        } catch (e) {
            return {errorMessages: errors};
        }
    }
}
export async function deleteAlbum(albumId) {
    let errors = [];
    try {
        albumId = validation.checkId(albumId, 'albumId');
    } catch (e) {
        errors.push(e);
    }
    if (errors.length > 0) {
        return {errorMessages: errors};
    } else {
        try {
            const client = getClient();
            const {data}  = await client.mutate({
                mutation: queries.REMOVE_ALBUM,
                variables: {id:albumId },
                // FIXME: REMOVING ALBUM DOES NOT REMOVE IT FROM THE UI
            });
            return {album: data?.removeAlbum};
        } catch (e) {
            // removeAlbum
            errors.push(e.message);
            return {errorMessages: errors};
        }
    }
}