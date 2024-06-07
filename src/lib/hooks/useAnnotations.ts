import { useEffect, useState } from 'react';
import type { W3CAnnotation } from '@annotorious/react';

export const useAnnotations = <T extends W3CAnnotation = W3CAnnotation>(path: string) => {

  const [annotations, setAnnotations] = useState<T[] | undefined>();

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
      })
      .catch(error => {
        console.log('Error fetching annotations', error);
      })
  }, []);

  return annotations;

}