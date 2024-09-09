import type { Annotation } from '@annotorious/react';
import { useEffect, useState } from 'react';
import type { RelatedAnnotation, RelatedImageAnnotation, RelatedVerseAnnotation } from 'src/Types';

interface Related {

  images?: RelatedImageAnnotation[];

  verses?: RelatedVerseAnnotation[];

}

export const useRelated = (annotation?: Annotation) => {

  const [all, setAll] = useState<RelatedAnnotation[]>([]);

  const [related, setRelated] = useState<Related>({ images: undefined, verses: undefined });

  useEffect(() => {
    fetch('../../tag-index.json')
      .then(res => res.json())
      .then(setAll);
  }, []);

  useEffect(() => {
    if (!all) return;

    if (annotation) {
      const tagIds = annotation.bodies
        .filter(b => b.purpose === 'tagging' && b.value)
        .map(b => b.id);

      const matches = 
        all.filter(a => a.id !== annotation.id && a.tags.some(t => tagIds.includes(t.id)));

      const images = matches.filter(r => r.type === 'IMAGE') as RelatedImageAnnotation[];
      const verses = matches.filter(r => r.type === 'VERSE') as RelatedVerseAnnotation[];
    
      setRelated({ images, verses });
    } else {
      setRelated({ images: undefined, verses: undefined });
    }
  }, [all, annotation]);

  return related;

}