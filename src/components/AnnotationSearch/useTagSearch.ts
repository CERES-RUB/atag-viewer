import { useEffect, useMemo, useState } from 'react';
import type { Annotation } from '@annotorious/react';
import Fuse from 'fuse.js';

interface FuseAnnotationDocument {

  annotationId: string;

  tags: string[];

}

const buildTagIndexFromAnnotations = (annotations: Annotation[]) => {
  const distinctTags = new Set(annotations.reduce<string[]>((all, annotation) => {
    const tags = annotation.bodies.filter(b => b.purpose === 'tagging' && b.value);
    return [...all, ...tags.map(b => b.value!)];
  }, []));

  return new Fuse<string>([...distinctTags], {
    shouldSort: true,
    threshold: 0.4
  });
}

const buildTagIndexFromThesaurus = () =>
  fetch('/thesaurus/all-concepts-compact.json')
    .then(res => res.json())
    .then(labels => {
      labels.sort();
      return new Fuse<string>([...labels], {
        shouldSort: true,
        threshold: 0.4
      })
    });

export const useTagSearch = (annotations: Annotation[], mode: 'FROM_ANNOTATIONS' | 'THESAURUS' = 'THESAURUS') => {

  const [tagIndex, setTagIndex] = useState<Fuse<string> | undefined>();

  const annotationsById = useMemo(() => 
      new Map(annotations.map(a => ([a.id, a]))), [annotations]);

  useEffect(() => {
    console.log('rebuilding search index', mode);
    if (mode === 'FROM_ANNOTATIONS') {
      const index = buildTagIndexFromAnnotations(annotations);
      setTagIndex(index);
    } else {
      buildTagIndexFromThesaurus().then(setTagIndex);
    }
  }, [mode, annotations]);

  const annotationIndex: Fuse<FuseAnnotationDocument> = useMemo(() => {
    const documents: FuseAnnotationDocument[] = annotations.map(a => {
      const annotationId = a.id;
  
      const tags: string[] = a.bodies
        .filter(b => b.purpose === 'tagging' && b.value)
        .map(b => b.value!);
  
      return { annotationId, tags };
    }).filter(d => d.tags.length > 0);

    return new Fuse<FuseAnnotationDocument>(documents, { 
      keys: ['tags'],
      shouldSort: true,
      threshold: 0.4
    });
  }, [annotations]);

  const search = (query: string, limit?: number): Annotation[] =>
    annotationIndex.search(query, { limit: limit || 500 })
      .map(r => annotationsById.get(r.item.annotationId)!)
      .filter(Boolean);

  const getSuggestions = (query: string, limit?: number): string[] => 
    tagIndex
     ? tagIndex.search(query, { limit: limit || 10 }).map(r => r.item)
     : [];

  return { search, getSuggestions };

}