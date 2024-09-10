import type { Annotation } from '@annotorious/react';

export interface ImageMetadata {

  slug: string;

  title: string;

  format: 'IIIF' | 'IMAGE',

  manifest?: string;

  annotations: number;

}

export interface VerseMetadata {

  slug: string;

  title: string;

  annotations: number;

}

export interface ThesaurusTerm {

  uri: string;

  localname: string;

  prefLabel: string;

  lang: string;

}

export interface Tag {

  id: string;

  label: string;

}

export interface RelatedImageAnnotation {

  type: 'IMAGE';

  id: string;

  thumbnail: string;

  image: string;
  
  slug: string;

  tags: Tag[];

}

export interface RelatedVerseAnnotation {

  type: 'VERSE';

  id: string;

  snippet?: VerseSnippet;

  verse: string;

  slug: string;

  tags: Tag[];

}

export interface VerseSnippet {

  prefix?: string;

  quote: string;

  suffix?: string;

}

export type RelatedAnnotation = RelatedImageAnnotation | RelatedVerseAnnotation;

export interface RelatedAnnotationGroup<T extends RelatedAnnotation = RelatedAnnotation> {

  common: Tag[];
  
  related: { annotation: T, score: number }[];

}

export interface Selected {

  annotation?: Annotation;

  relatedImages?: RelatedImageAnnotation[];

  relatedVerses?: RelatedVerseAnnotation[];

}