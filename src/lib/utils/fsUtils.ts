import fs from 'fs';
import type { ImageMetadata, VerseMetadata } from 'src/Types';

export const listImages = () => {
  const json = fs.readFileSync('./public/images.json');

  // Metadata without annotation count
  const images = JSON.parse(json.toString()) as Partial<ImageMetadata>[];

  return images.map(({ title, format, slug, manifest }) => {
    const json = fs.readFileSync(`./public/annotations/image/${slug}.json`);
    const annotations = JSON.parse(json.toString()).length;
    return { title, format, slug, manifest, annotations } as ImageMetadata;
  });
}

export const listVerses = (): VerseMetadata[] => {
  const json = fs.readFileSync('./public/verses.json');

  // Metadata without annotation count
  const verses = JSON.parse(json.toString()) as Partial<VerseMetadata>[];

  return verses.map(({ title, slug }) => {
    const json = fs.readFileSync(`./public/annotations/verse/${slug}.json`);
    const annotations = JSON.parse(json.toString()).length;
    return { title, slug, annotations } as VerseMetadata;
  });
}