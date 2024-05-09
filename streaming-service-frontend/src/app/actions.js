"use server";
import validation from "../utils/validations";
import queries from "../utils/queries";
import getApolloClient from "@/utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { useMutation } from "@apollo/client";

import httpClientReqs from "@/utils/http-client-reqs";
export async function createAlbum(prevState, formData, token) {
  const apolloClient = getApolloClient(token);
  let title,
    release_date,
    album_type,
    description,
    genres,
    visibility,
    songs,
    artists,
    cover_image_url;
  let errors = [];
  title = formData.title;
  release_date = formData.release_date;

  album_type = formData.album_type;
  description = formData.description;
  genres = formData.genres;
  visibility = formData.visibility;
  artists = formData.artists;
  songs = formData.songs;
  cover_image_url = formData.coverImageUrl;
  try {
    title = validation.checkString(title, "title");
  } catch (e) {
    errors.push(e);
  }
  try {
    album_type = validation.checkString(album_type, "album type");
  } catch (e) {
    errors.push(e);
  }
  try {
    description = validation.checkString(description, "description");
  } catch (e) {
    errors.push(e);
  }
  try {
    release_date = validation.checkDate(release_date, "release date");
  } catch (e) {
    errors.push(e);
  }
  try {
    genres = validation.checkStringArray(genres, "genres");
  } catch (e) {
    errors.push(e);
  }
  try {
    visibility = validation.checkString(visibility, "visibility");
  } catch (e) {
    errors.push(e);
  }
  try {
    artists = validation.checkIDArray(artists, "artists");
  } catch (e) {
    errors.push(e);
  }
  try {
    songs = validation.checkIDArray(songs, "songs");
  } catch (e) {
    errors.push(e);
  }
  try {
    cover_image_url = validation.checkId(cover_image_url, "cover_image_url");
  } catch (e) {
    errors.push(e);
  }
  if (errors.length > 0) {
    return { errorMessages: errors };
  } else {
    try {
      const { data } = await apolloClient.mutate({
        mutation: queries.ADD_ALBUM,
        variables: {
          title,
          release_date,
          album_type,
          description,
          genres,
          visibility,
          artists,
          songs,
          cover_image_url,
        },
      });
      return { album: data?.addAlbum };
    } catch (e) {
      return { errorMessages: [e.message] };
    }
  }
}
export async function updateAlbum(prevState, formData, token) {
  const apolloClient = getApolloClient(token);
  let title,
    release_date,
    album_type,
    description,
    genres,
    visibility,
    artistId,
    artists,
    albumId,
    cover_image_url;
  let errors = [];
  albumId = formData.get("albumId");
  title = formData.get("title");
  release_date = formData.get("release_date");
  album_type = formData.get("album_type");
  description = formData.get("description");
  genres = formData.getAll("genres");
  visibility = formData.get("visibility");
  artistId = formData.get("artistId");
  cover_image_url = formData.get("cover_image_url");
  try {
    if (title) {
      title = validation.checkString(title, "title");
    }
  } catch (e) {
    errors.push(e);
  }
  try {
    if (release_date) {
      release_date = validation.dateTimeString(
        release_date,
        "release_date",
        true
      );
    }
  } catch (e) {
    errors.push(e);
  }
  try {
    if (album_type) {
      album_type = validation.checkString(album_type, "album_type");
    }
  } catch (e) {
    errors.push(e);
  }

  try {
    if (description) {
      description = validation.checkString(description, "description");
    }
    try {
      if (genres) {
        genres = validation.checkStringArray(genres, "genres");
      }
    } catch (e) {
      errors.push(e);
    }
  } catch (e) {
    errors.push(e);
  }
  try {
    if (visibility) {
      visibility = validation.checkString(visibility, "visibility");
    }
  } catch (e) {
    errors.push(e);
  }
  try {
    artistId = validation.checkId(artistId, "artistId");
    albumId = validation.checkId(albumId, "albumId");
    artists = [artistId];
  } catch (e) {
    errors.push(e);
  }

  if (errors.length > 0) {
    return { errorMessages: errors };
  } else {
    try {
      const { data } = await apolloClient.mutate({
        mutation: queries.EDIT_ALBUM,
        variables: {
          _id: albumId,
          title,
          release_date,
          album_type,
          description,
          genres,
          visibility,
          artists,
        },
        // https://www.apollographql.com/docs/react/data/mutations/#updating-local-data
      });
      return { album: data?.editAlbum };
    } catch (e) {
      errors.push(e);
    }
    if (cover_image_url) {
      try {
        cover_image_url = await httpClientReqs.uploadFile(cover_image_url);
      } catch (error) {
        errors.push(
          `Failed to upload cover image file - ${error?.message} - ${error?.cause}`
        );
      }
    }

    if (errors.length > 0) {
      return { errorMessages: errors };
    } else {
      try {
        const { data } = await apolloClient.mutate({
          mutation: queries.EDIT_ALBUM,
          variables: {
            _id: albumId,
            title,
            release_date,
            album_type,
            description,
            genres,
            visibility,
            artists,
            cover_image_url,
          },
          // https://www.apollographql.com/docs/react/data/mutations/#updating-local-data
        });
        return { album: data?.editAlbum };
      } catch (e) {
        errors.push(e?.message);
        return { errorMessages: errors };
      }
    }
  }
}
export async function deleteAlbum(albumId, token) {
  const apolloClient = getApolloClient(token);
  let errors = [];
  try {
    albumId = validation.checkId(albumId, "albumId");
  } catch (e) {
    errors.push(e);
  }
  if (errors.length > 0) {
    return { errorMessages: errors };
  } else {
    try {
      const { data } = await apolloClient.mutate({
        mutation: queries.REMOVE_ALBUM,
        variables: { id: albumId },
        // FIXME: REMOVING ALBUM DOES NOT REMOVE IT FROM THE UI
      });
      return { album: data?.removeAlbum };
    } catch (e) {
      // removeAlbum
      errors.push(e.message);
      return { errorMessages: errors };
    }
    if (errors.length > 0) {
      return { errorMessages: errors };
    } else {
      try {
        const { data } = await apolloClient.mutate({
          mutation: queries.REMOVE_ALBUM,
          variables: { id: albumId },
        });
        return { album: data?.removeAlbum };
      } catch (e) {
        errors.push(e?.message);
        return { errorMessages: errors };
      }
    }
  }
}
export async function createSong(prevState, formData, token) {
  const apolloClient = getApolloClient(token);
  let title,
    duration,
    song_url,
    cover_image_url,
    writtenBy,
    producers,
    genre,
    release_date,
    artists,
    artistId,
    lyrics,
    album;
  let errors = [];
  title = formData.get("title");
  duration = formData.get("duration");
  song_url = formData.get("song_url");
  cover_image_url = formData.get("cover_image_url");
  writtenBy = formData.get("writtenBy");
  producers = formData.get("producers");
  genre = formData.get("genre");
  release_date = formData.get("release_date");
  artistId = formData.get("artistId");
  // artists = formData.get("artists");
  lyrics = formData.get("lyrics");
  album = formData.get("album");
  try {
    title = validation.checkString(title, "title");
  } catch (e) {
    errors.push(e?.message);
  }
  try {
    song_url = await httpClientReqs.uploadFile(song_url);
  } catch (error) {
    errors.push(`Failed to upload song mp3 file - ${error?.message}`);
  }
  try {
    cover_image_url = await httpClientReqs.uploadFile(cover_image_url);
  } catch (error) {
    errors.push(`Failed to upload cover image file - ${error?.message}`);
  }
  try {
    writtenBy = validation.checkString(writtenBy, "writtenBy");
  } catch (e) {
    errors.push(e?.message);
  }
  try {
    producers = validation.checkString(producers, "producers");
    producers = producers.split(";");
  } catch (e) {
    errors.push(e?.message);
  }
  try {
    genre = validation.checkString(genre, "genre");
  } catch (e) {
    errors.push(e?.message);
  }
  try {
    validation.dateTimeString(release_date, "release_date", true);
    release_date = validation.isoToUsDateFormat(release_date, "release_date");
  } catch (e) {
    errors.push(e?.message);
  }
  try {
    artistId = validation.checkId(artistId, "artistId");
    artists = [artistId];
  } catch (e) {
    errors.push(e?.message);
  }

  // Optional fields
  try {
    if (album !== null && album !== undefined && album?.trim() !== "") {
      album = validation.checkId(album, "album");
    } else {
      album = undefined;
    }
  } catch (e) {
    errors.push(e?.message);
  }
  try {
    if (
      duration !== null &&
      duration !== undefined &&
      duration?.trim() !== ""
    ) {
      duration = validation.checkNumber(parseInt(duration, 10), "duration");
    } else {
      duration = undefined;
    }
  } catch (e) {
    errors.push(e?.message);
  }
  try {
    if (lyrics !== null && lyrics !== undefined && lyrics?.trim() !== "") {
      lyrics = validation.checkString(lyrics, "lyrics");
    } else {
      lyrics = undefined;
    }
  } catch (e) {
    errors.push(e?.message);
  }

  if (errors.length > 0) {
    return { errorMessages: errors };
  } else {
    try {
      const { data } = await apolloClient.mutate({
        mutation: queries.ADD_SONG,
        variables: {
          title,
          duration,
          song_url,
          cover_image_url,
          writtenBy,
          producers,
          genre,
          release_date,
          artists,
          lyrics,
          album,
        },
      });
      return { song: data?.addSong };
    } catch (e) {
      errors.push(e?.message);
      return { errorMessages: errors };
    }
  }
}
export async function updateSong(
  prevState,
  formData,
  token,
  inputCoverImageUrl,
  inputSongUrl
) {
  // console.log("inputCoverImageUrl", inputCoverImageUrl);
  // console.log("inputSongUrl", inputSongUrl);
  // console.log("formData", formData);
  const apolloClient = getApolloClient(token);
  let songId,
    title,
    duration,
    song_url,
    cover_image_url,
    writtenBy,
    producers,
    genre,
    release_date,
    artists,
    artistId,
    lyrics,
    album;
  let errors = [];
  songId = formData.get("songId");
  title = formData.get("title");
  duration = formData.get("duration");
  song_url = formData.get("song_url") ? formData.get("song_url") : inputSongUrl; // Use inputSongUrl if song_url is not provided
  cover_image_url = formData.get("cover_image_url")
    ? formData.get("cover_image_url")
    : inputCoverImageUrl; // Use inputCoverImageUrl if cover_image_url is not provided
  writtenBy = formData.get("writtenBy");
  producers = formData.get("producers"); // [String]
  genre = formData.get("genre"); // MusicGenre
  release_date = formData.get("release_date");
  artistId = formData.get("artistId");
  lyrics = formData.get("lyrics");

  try {
    songId = validation.checkId(songId, "songId");
  } catch (e) {
    errors.push(e.message);
  }
  try {
    if (title) {
      title = validation.checkString(title, "title");
    } else {
      title = undefined;
    }
  } catch (e) {
    errors.push(e.message);
  }
  try {
    if (
      duration !== null &&
      duration !== undefined &&
      duration?.trim() !== ""
    ) {
      duration = validation.checkNumber(parseInt(duration, 10), "duration");
    } else {
      duration = undefined;
    }
  } catch (e) {
    errors.push(e.message);
  }
  try {
    if (song_url && song_url?.size > 0) {
      song_url = await httpClientReqs.uploadFile(song_url);
    } else {
      song_url = undefined;
    }
  } catch (error) {
    errors.push(`Failed to upload song mp3 file - ${error?.message}`);
  }
  try {
    if (cover_image_url && cover_image_url?.size > 0) {
      cover_image_url = await httpClientReqs.uploadFile(cover_image_url);
    } else {
      cover_image_url = undefined;
    }
  } catch (error) {
    errors.push(`Failed to upload cover image file - ${error?.message}`);
  }
  try {
    if (writtenBy) {
      writtenBy = validation.checkString(writtenBy, "writtenBy");
    } else {
      writtenBy = undefined;
    }
  } catch (e) {
    errors.push(e.message);
  }
  try {
    if (producers) {
      producers = validation.checkString(producers, "producers");
      producers = producers.split(";");
    } else {
      producers = undefined;
    }
  } catch (e) {
    errors.push(e.message);
  }
  try {
    if (genre) {
      genre = validation.checkString(genre, "genre");
    } else {
      genre = undefined;
    }
  } catch (e) {
    errors.push(e.message);
  }
  try {
    if (release_date) {
      validation.dateTimeString(release_date, "release_date", true);
    } else {
      release_date = undefined;
    }
    release_date = validation.isoToUsDateFormat(release_date, "release_date");
  } catch (e) {
    errors.push(e.message);
  }
  if (errors.length > 0) {
    return { errorMessages: errors };
  } else {
    try {
      const { data } = await apolloClient.mutate({
        mutation: queries.EDIT_SONG,
        variables: {
          songId,
          title,
          duration,
          song_url,
          cover_image_url,
          writtenBy,
          producers,
          genre,
          release_date,
        },
      });
      return { song: data?.editSong };
    } catch (e) {
      errors.push(e?.message);
      return { errorMessages: errors };
    }
  }
}
export async function deleteSong(songId, token) {
  const apolloClient = getApolloClient(token);
  let errors = [];
  try {
    songId = validation.checkId(songId, "songId");
  } catch (e) {
    errors.push(e?.message);
  }
  if (errors.length > 0) {
    return { errorMessages: errors };
  } else {
    try {
      const { data } = await apolloClient.mutate({
        mutation: queries.REMOVE_SONG,
        variables: { songId },
      });
      return { song: data?.removeSong };
    } catch (e) {
      errors.push(e?.message);
      return { errorMessages: errors };
    }
  }
}
