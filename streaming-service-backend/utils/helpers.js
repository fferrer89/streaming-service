import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { GraphQLError } from 'graphql';
export const MusicGenres = [
  'ACOUSTIC',
  'AFROBEAT',
  'ALT_ROCK',
  'ALTERNATIVE',
  'AMBIENT',
  'ANIME',
  'BLACK_METAL',
  'BLUEGRASS',
  'BLUES',
  'BOSSANOVA',
  'BRAZIL',
  'BREAKBEAT',
  'BRITISH',
  'CANTOPOP',
  'CHICAGO_HOUSE',
  'CHILDREN',
  'CHILL',
  'CLASSICAL',
  'CLUB',
  'COMEDY',
  'COUNTRY',
  'DANCE',
  'DANCEHALL',
  'DEATH_METAL',
  'DEEP_HOUSE',
  'DETROIT_TECHNO',
  'DISCO',
  'DISNEY',
  'DRUM_AND_BASS',
  'DUB',
  'DUBSTEP',
  'EDM',
  'ELECTRO',
  'ELECTRONIC',
  'EMO',
  'FOLK',
  'FORRO',
  'FRENCH',
  'FUNK',
  'GARAGE',
  'GERMAN',
  'GOSPEL',
  'GOTH',
  'GRINDCORE',
  'GROOVE',
  'GRUNGE',
  'GUITAR',
  'HAPPY',
  'HARD_ROCK',
  'HARDCORE',
  'HARDSTYLE',
  'HEAVY_METAL',
  'HIP_HOP',
  'HOLIDAYS',
  'HONKY_TONK',
  'HOUSE',
  'IDM',
  'INDIAN',
  'INDIE',
  'INDIE_POP',
  'INDUSTRIAL',
  'IRANIAN',
  'J_DANCE',
  'J_IDOL',
  'J_POP',
  'J_ROCK',
  'JAZZ',
  'K_POP',
  'KIDS',
  'LATIN',
  'LATINO',
  'MALAY',
  'MANDOPOP',
  'METAL',
  'METAL_MISC',
  'METALCORE',
  'MINIMAL_TECHNO',
  'MOVIES',
  'MPB',
  'NEW_AGE',
  'NEW_RELEASE',
  'OPERA',
  'PAGODE',
  'PARTY',
  'PHILIPPINES_OPM',
  'PIANO',
  'POP',
  'POP_FILM',
  'POST_DUBSTEP',
  'POWER_POP',
  'PROGRESSIVE_HOUSE',
  'PSYCH_ROCK',
  'PUNK',
  'PUNK_ROCK',
  'R_N_B',
  'RAINY_DAY',
  'REGGAE',
  'REGGAETON',
  'ROAD_TRIP',
  'ROCK',
  'ROCK_N_ROLL',
  'ROCKABILLY',
  'ROMANCE',
  'SAD',
  'SALSA',
  'SAMBA',
  'SERTANEJO',
  'SHOW_TUNES',
  'SINGER_SONGWRITER',
  'SKA',
  'SLEEP',
  'SONGWRITER',
  'SOUL',
  'SOUNDTRACKS',
  'SPANISH',
  'STUDY',
  'SUMMER',
  'SWEDISH',
  'SYNTH_POP',
  'TANGO',
  'TECHNO',
  'TRANCE',
  'TRIP_HOP',
  'TURKISH',
  'WORK_OUT',
  'WORLD_MUSIC',
];
export const Visibilities = ['PUBLIC', 'PRIVATE'];
export const AlbumTypes = ['ALBUM', 'SINGLE', 'COMPILATION', 'APPEARS_ON'];
export const Genders = ['MALE', 'FEMALE', 'OTHER'];

export const generateToken = (userId, role, name) => {
  console.log(userId, role, name, process.env.JWT_SECRET);
  return jwt.sign({ id: userId, role, name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  });
};

export const validateMogoObjID = (id, name) => {
  if (!ObjectId.isValid(id)) {
    throw new GraphQLError(`${name} is not a valid mongo object id`, {
      extensions: {
        code: 'BAD_USER_INPUT',
      },
    });
  }
};

export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization || '';

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.exp <= Math.floor(Date.now() / 1000)) {
      throw new Error('Token expired');
    }
    req.decoded = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
