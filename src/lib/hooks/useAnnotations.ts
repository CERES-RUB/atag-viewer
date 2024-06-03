import { useEffect, useState } from 'react';
import type { W3CAnnotation, W3CImageAnnotation } from '@annotorious/react';

export const useAnnotations = (path: string) => {

  const [annotations, setAnnotations] = useState<W3CImageAnnotation[]>([]);

  useEffect(() => {
    fetch(`../../${path}`)
      .then((response) => response.json())
      .then(annotations => {
        const filtered = 
          // Remove annotations without tags
          annotations.filter((a: W3CAnnotation) => {
            const bodies = Array.isArray(a.body) ? a.body : [a.body];
            return bodies.some(b => b.purpose === 'tagging');
          });

        setAnnotations(filtered);
      });
  }, []);

  return annotations;

}