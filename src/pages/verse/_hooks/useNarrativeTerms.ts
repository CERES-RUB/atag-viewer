import { useEffect, useState } from 'react';
import type { ThesaurusTerm } from 'src/Types';

export const useNarrativeTerms = () => {

  const [terms, setTerms] = useState<Set<string> | undefined>();

  useEffect(() => {
    fetch('../../thesaurus/narratives.json')
      .then(res => res.json())
      .then(terms => {
        // If only all data were clean...
        const values = terms.map((t: ThesaurusTerm) => t.prefLabel?.trim()).filter(Boolean);
        setTerms(new Set(values));
      });
  }, []);

  return terms;

}