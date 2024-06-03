import fs from 'fs';
import type { ImageMetadata, VerseMetadata } from 'src/Types';

export const listImages = () => {
  const json = fs.readFileSync('./public/images.json');
  return JSON.parse(json.toString()) as ImageMetadata[];
}

export const listVerses = () => {
  const json = fs.readFileSync('./public/verses.json');
  return JSON.parse(json.toString()) as VerseMetadata[];
}