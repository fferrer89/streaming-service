import { GraphQLError } from 'graphql';
import { Types } from 'mongoose';
import { ObjectId } from 'mongodb';
const ObjectIdtoString = (songs) => {
  const ObjToStr = (song) => {
    song.album = song.album.toString();
    song.artists = song.artists.map((id) => id.toString());
    song.id = song._id.toString();
    song.genre = song.genre.toUpperCase();
    return song;
  };
  if (Array.isArray(songs)) {
    songs = songs.map((song) => ObjToStr(song));
    return songs;
  }
  return ObjToStr(songs);
};

const emptyValidation = (str, param) => {
  str = str.trim();
  if (str.trim().length == 0) {
    throw new GraphQLError(`${param} Cant be empty`, {
      extensions: {
        code: 'BAD_USER_INPUT',
      },
    });
  }
  return str;
};

const badUserInputWrapper = (msg = 'Invalid Input') => {
  throw new GraphQLError(msg, {
    extensions: {
      code: 'BAD_USER_INPUT',
    },
  });
};

const notFoundWrapper = (msg = 'Not Found') => {
  throw new GraphQLError(msg, {
    extensions: {
      code: 'NOT_FOUND',
    },
  });
};

const serverSideErrorWrapper = (msg = 'Something went wrong') => {
  throw new GraphQLError(msg, {
    extensions: {
      code: 'INTERNAL_SERVER_ERROR',
    },
  });
};

const unAuthorizedWrapper = (msg = 'You are not Authorized') => {
  throw new GraphQLError(msg, {
    extensions: {
      code: 'FORBIDDEN',
    },
  });
};

const validNumber = (num, parameter = 'input', min = null, max = null) => {
  if (min != null) {
    if (num < min) {
      throw `${parameter} can must be greater than or equal to ${min}`;
    }
  }
  if (max != null) {
    if (num > max) {
      throw `${parameter} can must be less than or equal to ${max}`;
    }
  }
  return num;
};

const validDate = (date, param) => {
  date = date.trim();
  if (date.length == 0) {
    badUserInputWrapper('Release Date is empty');
  }
  date = date.split('/'); // MM/DD/YYYY
  if (date.length !== 3) {
    badUserInputWrapper(`Invalid date format`);
  }

  // Month;
  validNumber(Number(date[0]), 'month', 1, 12);

  //day
  validNumber(Number(date[1]), 'day', 1, 31);

  //year
  validNumber(Number(date[2], 'year', 0, 2024));

  //leap year
  if (
    Number(date[0]) == 2 &&
    Number(date[1]) > 28 &&
    Number(date[2]) % 4 != 0
  ) {
    badUserInputWrapper('Invalid Date- not a leap year');
  }

  const format = `${date[0]}/${date[1]}/${date[2]}`;
  let inputDate = new Date(format);
  if (
    Number(inputDate.getDate()) != Number(date[1]) ||
    Number(inputDate.getMonth()) + 1 != Number(date[0]) ||
    Number(inputDate.getFullYear()) != Number(date[2])
  ) {
    badUserInputWrapper('Invalid Date');
  }

  const currentDate = new Date();

  if (inputDate > currentDate) {
    badUserInputWrapper(`Date can't be in future`);
  }

  return inputDate;
};

const validGenre = (genre) => {
  let genreSet = new Set([
    'acoustic',
    'afrobeat',
    'alt-rock',
    'alternative',
    'ambient',
    'anime',
    'black-metal',
    'bluegrass',
    'blues',
    'bossanova',
    'brazil',
    'breakbeat',
    'british',
    'cantopop',
    'chicago-house',
    'children',
    'chill',
    'classical',
    'club',
    'comedy',
    'country',
    'dance',
    'dancehall',
    'death-metal',
    'deep-house',
    'detroit-techno',
    'disco',
    'disney',
    'drum-and-bass',
    'dub',
    'dubstep',
    'edm',
    'electro',
    'electronic',
    'emo',
    'folk',
    'forro',
    'french',
    'funk',
    'garage',
    'german',
    'gospel',
    'goth',
    'grindcore',
    'groove',
    'grunge',
    'guitar',
    'happy',
    'hard-rock',
    'hardcore',
    'hardstyle',
    'heavy-metal',
    'hip-hop',
    'holidays',
    'honky-tonk',
    'house',
    'idm',
    'indian',
    'indie',
    'indie-pop',
    'industrial',
    'iranian',
    'j-dance',
    'j-idol',
    'j-pop',
    'j-rock',
    'jazz',
    'k-pop',
    'kids',
    'latin',
    'latino',
    'malay',
    'mandopop',
    'metal',
    'metal-misc',
    'metalcore',
    'minimal-techno',
    'movies',
    'mpb',
    'new-age',
    'new-release',
    'opera',
    'pagode',
    'party',
    'philippines-opm',
    'piano',
    'pop',
    'pop-film',
    'post-dubstep',
    'power-pop',
    'progressive-house',
    'psych-rock',
    'punk',
    'punk-rock',
    'r-n-b',
    'rainy-day',
    'reggae',
    'reggaeton',
    'road-trip',
    'rock',
    'rock-n-roll',
    'rockabilly',
    'romance',
    'sad',
    'salsa',
    'samba',
    'sertanejo',
    'show-tunes',
    'singer-songwriter',
    'ska',
    'sleep',
    'songwriter',
    'soul',
    'soundtracks',
    'spanish',
    'study',
    'summer',
    'swedish',
    'synth-pop',
    'tango',
    'techno',
    'trance',
    'trip-hop',
    'turkish',
    'work-out',
    'world-music',
  ]);
  genre = emptyValidation(genre, 'Genre');

  if (!genreSet.has(genre.toLowerCase())) badUserInputWrapper('Invalid Genre');

  return genre;
};

const validURL = (url) => {
  let regexURL =
    /^(?:https?|ftp):\/\/[\w\-]+(?:\.[\w\-]+)+(?:[\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
  if (!regexURL.test(url)) badUserInputWrapper('Invalid URL');
};

const validObjectId = (id, field = 'input') => {
  try {
    // let objId = new Types.ObjectId(id);
    if (!ObjectId.isValid(id.trim()))
      badUserInputWrapper(`Invalid Id for ${field}`);
  } catch (error) {
    return error;
  }
  return id;
};

export default {
  validGenre,
  ObjectIdtoString,
  unAuthorizedWrapper,
  emptyValidation,
  notFoundWrapper,
  badUserInputWrapper,
  validDate,
  validURL,
  serverSideErrorWrapper,
  validObjectId,
};
