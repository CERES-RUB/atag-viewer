import fs from 'fs';
import type { ImageMetadata, VerseMetadata } from 'src/Types';

export const listImages = () => {
  const json = fs.readFileSync('./public/images.json');

  // Metadata without annotation count
  const images = JSON.parse(json.toString()) as Partial<ImageMetadata>[];

  return images.map(data => {
    const json = fs.readFileSync(`./public/annotations/image/${data.slug}.json`);

    const annotations = JSON.parse(json.toString()).length;

    return { 
      annotations,
      credits: data.credits,
      dimensions: data.dimensions,
      format: data.format, 
      license: data.license,
      manifest: data.manifest,
      provenance: data.provenance,
      recogito: data.recogito,
      slug: data.slug,
      source: data.source,
      title: data.title 
    } as ImageMetadata;
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