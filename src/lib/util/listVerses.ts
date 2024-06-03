import fs from 'fs';
import type { VerseMetadata } from 'src/Types';

export const listVerses = () => {
  const json = fs.readFileSync('./public/verses.json');
  return JSON.parse(json.toString()) as VerseMetadata[];
}