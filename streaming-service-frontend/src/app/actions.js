'use server'; // Server Render Environment
import validation from '../utils/validations';
import queries from "../utils/queries";
import { getClient } from "../utils";
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
            });
            return {album: data?.addAlbum};
        } catch (e) {
            errors.push(e?.message);
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
            errors.push(e?.message);
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
            });
            return {album: data?.removeAlbum};
        } catch (e) {
            errors.push(e?.message);
            return {errorMessages: errors};
        }
    }
}

export async function createSong(prevState, formData) {
    let title, song_url, cover_image_url, writtenBy, producers, genre, release_date, artists, album;
    let errors = [];
    title = formData.get('title');
    song_url = formData.get('song_url'); // ID
    cover_image_url = formData.get('cover_image_url'); // ID
    writtenBy = formData.get('writtenBy');
    producers = formData.get('producers'); // [String]
    genre = formData.get('genre'); // MusicGenre
    release_date = formData.get('release_date');
    artists = formData.get('artists'); // [ID]
    album = formData.get('album'); // ID
    try {
        title = validation.checkString(title, 'title');
    } catch (e) {
        errors.push(e);
    }
    try {
        song_url = validation.checkId(song_url, 'song_url');
    } catch (e) {
        errors.push(e);
    }
    try {
        cover_image_url = validation.checkId(cover_image_url, 'cover_image_url');
    } catch (e) {
        errors.push(e);
    }
    try {
        writtenBy = validation.checkString(writtenBy, 'writtenBy');
    } catch (e) {
        errors.push(e);
    }
    try {
        producers = validation.checkStringArray(producers, 'producers');
    } catch (e) {
        errors.push(e);
    }
    try {
        genre = validation.checkString(genre, 'genre');
    } catch (e) {
        errors.push(e);
    }
    try {
        // TODO: Release date
    } catch (e) {
        errors.push(e);
    }
    try {
        // TODO: artists
    } catch (e) {
        errors.push(e);
    }
    try {
        album = validation.checkId(album, 'album');
    } catch (e) {
        errors.push(e);
    }
    if (errors.length > 0) {
        return {errorMessages: errors};
    } else {
        try {
            const client = getClient();
            const {data}  = await client.mutate({
                mutation: queries.ADD_SONG,
                variables: { title, song_url, cover_image_url, writtenBy, producers, genre, release_date, artists, album },
            });
            return {song: data?.addSong};
        } catch (e) {
            errors.push(e?.message);
            return {errorMessages: errors};
        }
    }
}
export async function updateSong(prevState, formData) {
    let songId, title, duration, song_url, cover_image_url, writtenBy, producers, genre, release_date, artists, album;
    let errors = [];
    songId = formData.get('songId');
    title = formData.get('title');
    duration = formData.get('duration');
    song_url = formData.get('song_url'); // ID
    cover_image_url = formData.get('cover_image_url'); // ID
    writtenBy = formData.get('writtenBy');
    producers = formData.get('producers'); // [String]
    genre = formData.get('genre'); // MusicGenre
    release_date = formData.get('release_date');
    artists = formData.get('artists'); // [ID]
    // album = formData.get('album'); // ID
    try {
        songId = validation.checkId(songId, 'songId');
    } catch (e) {
        errors.push(e);
    }
    try {
        if (title) {
            title = validation.checkString(title, 'title');
        }
    } catch (e) {
        errors.push(e);
    }
    try {
        if (duration) {
            // TODO: Validate duration
        }
    } catch (e) {
        errors.push(e);
    }
    try {
        if (song_url) {
            song_url = validation.checkId(song_url, 'song_url');
        }
    } catch (e) {
        errors.push(e);
    }
    try {
        if (cover_image_url) {
            cover_image_url = validation.checkId(cover_image_url, 'cover_image_url');
        }
    } catch (e) {
        errors.push(e);
    }
    try {
        if (writtenBy) {
            writtenBy = validation.checkString(writtenBy, 'writtenBy');
        }
    } catch (e) {
        errors.push(e);
    }
    try {
        if (producers) {
            producers = validation.checkStringArray(producers, 'producers');
        }
    } catch (e) {
        errors.push(e);
    }
    try {
        if (genre) {
            genre = validation.checkString(genre, 'genre');
        }
    } catch (e) {
        errors.push(e);
    }
    try {
        if (release_date) {
            // TODO: Release date
        }
    } catch (e) {
        errors.push(e);
    }
    try {
        if (artists) {
            // TODO: artists
        }
    } catch (e) {
        errors.push(e);
    }
    if (errors.length > 0) {
        return {errorMessages: errors};
    } else {
        try {
            const client = getClient();
            const {data}  = await client.mutate({
                mutation: queries.EDIT_SONG,
                variables: {songId, title, duration, song_url, cover_image_url, writtenBy, producers, genre, release_date, artists },
            });
            return {song: data?.editSong};
        } catch (e) {
            errors.push(e?.message);
            return {errorMessages: errors};
        }
    }
}
export async function deleteSong(songId) {
    let errors = [];
    try {
        songId = validation.checkId(songId, 'songId');
    } catch (e) {
        errors.push(e);
    }
    if (errors.length > 0) {
        return {errorMessages: errors};
    } else {
        try {
            const client = getClient();
            const {data}  = await client.mutate({
                mutation: queries.REMOVE_SONG,
                variables: { songId },
            });
            return {song: data?.removeSong};
        } catch (e) {
            errors.push(e?.message);
            return {errorMessages: errors};
        }
    }
}