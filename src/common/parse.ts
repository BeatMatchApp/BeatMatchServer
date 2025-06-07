import { Song } from '../models';
import { aiParsingError } from './errors';

const NUMERIC_ORDER_REGEX: RegExp = /^\d+\.\s*/;
const SONG_FORMAT_REGEX: RegExp = /^[^-–]+[-–][^-–]+$/;
const DASHES_REGEX: RegExp = /\s[-–]\s/;

export const parseSongs = (text: string): Song[] => {
  try {
    const separatedLines: string[] = text
      .split('\n')
      .map((line) => line.replace(NUMERIC_ORDER_REGEX, '').trim())
      .filter((line) => SONG_FORMAT_REGEX.test(line));

    const songsList: Song[] = separatedLines
      .map((line: string) => {
        const separatorMatch = line.match(DASHES_REGEX);
        if (!separatorMatch) return null;

        const separator = separatorMatch[0];
        const [title, artist] = line.split(separator);

        if (!title || !artist) return null;

        const song: Song = { name: title.trim(), artist: artist.trim() };

        return song;
      })
      .filter((song): song is Song => song !== null);

    return songsList;
  } catch (err) {
    throw new aiParsingError(500);
  }
};
