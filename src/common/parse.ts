import {
  DASHES_REGEX,
  NUMERIC_ORDER_REGEX,
  SONG_FORMAT_REGEX,
} from '../consts/regex';
import { Song } from '../models';
import { AIParsingError } from './errors';

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
    throw new AIParsingError(500);
  }
};
