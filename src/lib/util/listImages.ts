import fs from 'fs';
import type { ImageMetadata } from 'src/Types';

export const listImages = () => {
  const json = fs.readFileSync('./public/images.json');
  return JSON.parse(json.toString()) as ImageMetadata[];
}