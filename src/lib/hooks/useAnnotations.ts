import { useEffect, useState } from 'react';
import type { W3CAnnotation } from '@annotorious/react';

export const useAnnotations = <T extends W3CAnnotation = W3CAnnotation>(path: string) => {

  const [annotations, setAnnotations] = useState<T[] | undefined>();

  useEffect(() => {
    fetch(`../../${path}`)
      .then((response) => response.json())
      .then(annotations => {
        const filtered = 
          annotations.filter((a: W3CAnnotation) => {
            // Remove annotations without tags
            const bodies = Array.isArray(a.body) ? a.body : [a.body];
            const hasTags = bodies.some(b => b.purpose === 'tagging');

            // Remove image point annotations
            const target = Array.isArray(a.target) ? a.target[0] : a.target;
            const selectors = Array.isArray(target.selector) ? target.selector : [target.selector];

            const fragmentSelector = selectors.find(s => s.type === 'FragmentSelector');
            const isPointAnnotation = fragmentSelector && (fragmentSelector.value as string).endsWith(',0,0');

            return hasTags && !isPointAnnotation;
          });

        setAnnotations(filtered);
      })
      .catch(error => {
        console.log('Error fetching annotations', error);
      })
  }, []);

  return annotations;

}