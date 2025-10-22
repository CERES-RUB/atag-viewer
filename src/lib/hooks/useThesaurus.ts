import { useEffect, useState } from 'react';
import type { Tag } from 'src/Types';

export const useThesaurus = () => {

  const [tags, setTags] = useState<Tag[] | undefined>();

  useEffect(() => {
    fetch('../../thesaurus/all-concepts.json')
    .then(res => res.json())
    .then(terms => {
      const tags = terms
        .map((t: any) => ({ id: t.uri, label: t.prefLabel?.trim() }))
        .filter((t: Tag) => t.label)
      
      setTags(tags);
    });
  }, []);

  return tags;

}