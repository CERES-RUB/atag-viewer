import { useEffect, useState } from 'react';
import type { ThesaurusTerm } from 'src/Types';

export const useNarrativeTerms = () => {

  const [terms, setTerms] = useState<ThesaurusTerm[]>([]);

  useEffect(() => {
    fetch('../../thesaurus/narratives.json')
      .then(res => res.json())
      .then(terms => {
        // If only all data were clean...
        setTerms(terms.map((t: ThesaurusTerm) => ({
          ...t,
          prefLabel: t.prefLabel ? t.prefLabel.trim() : undefined
        })))
      });
  }, []);

  return terms;

}