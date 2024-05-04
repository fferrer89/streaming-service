'use server'; // Server Render Environment
import validation from '../utils/validations';
import queries from "../utils/queries";
import { getClient } from "../utils";
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {useQuery} from "@apollo/client";
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
            errors.push(e.message);
            errors.push(queries.ADD_ALBUM);
            errors.push(title, release_date, album_type, description, genres, visibility, artists);
            return {errorMessages: errors};
        }

        /*
        @link: https://nextjs.org/docs/app/api-reference/functions/revalidatePath
        Adds the newly added user to the '/users' STATIC page
        */
        // revalidatePath(`/artists/${artistId}`);
        revalidatePath('/artists/[id]', 'page'); // revalidatePath('/')
        /*
        redirect returns a 307 (Temporary Redirect) status code by default. When used in a Server Action, it
        returns a 303 (See Other), which is commonly used for redirecting to a success page as a result of a
        POST request.

        redirect internally throws an error, so it should be called outside of try/catch blocks.
         */
        redirect(`/artists/${artistId}`); // Navigate to new route
    }
}