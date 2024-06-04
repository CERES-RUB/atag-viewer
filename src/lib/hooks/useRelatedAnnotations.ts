import type { Annotation } from '@annotorious/react';
import { useEffect, useState } from 'react';
import type { RelatedAnnotation } from 'src/Types';

export const useRelated = (annotation?: Annotation) => {

  const [all, setAll] = useState<RelatedAnnotation[]>([]);

  const [related, setRelated] = useState<RelatedAnnotation[] | undefined>([]);

  useEffect(() => {
    fetch('../../tag-index.json')
      .then(res => res.json())
      .then(setAll);
  }, []);

  useEffect(() => {
    if (!all) return;

    if (annotation) {
      const tags = annotation.bodies
        .filter(b => b.purpose === 'tagging' && b.value)
        .map(b => b.value!);
    
      setRelated(all.filter(a => a.tags.some(t => tags.includes(t))));
    } else {
      setRelated(undefined);
    }
  }, [all, annotation]);

  return related;

}