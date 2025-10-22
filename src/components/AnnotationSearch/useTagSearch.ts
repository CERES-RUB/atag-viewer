import { useEffect, useMemo, useState } from 'react';
import type { Annotation } from '@annotorious/react';
import diacritics from 'diacritics';
import Fuse from 'fuse.js';

interface FuseAnnotationDocument {

  annotationId: string;

  tags: FuseTag[];

}

interface FuseTag {

  value: string;

  normalized: string;

}

const SUGGEST_THRESHOLD = 0.3;

const buildTagIndexFromAnnotations = (annotations: Annotation[]) => {
  const distinctTags = new Set(annotations.reduce<string[]>((all, annotation) => {
    const tags = annotation.bodies.filter(b => b.purpose === 'tagging' && b.value);
    return [...all, ...tags.map(b => b.value!)];
  }, []));

  const tags: FuseTag[] = [...distinctTags].map((l: string) => 
    ({ value: l, normalized: diacritics.remove(l) }));

  return new Fuse<FuseTag>(tags, {
    keys: ['normalized'],
    shouldSort: true,
    threshold: SUGGEST_THRESHOLD
  });
}

const buildTagIndexFromThesaurus = () =>
  fetch('../../thesaurus/all-concepts-compact.json')
    .then(res => res.json())
    .then(labels => {
      labels.sort();

      const tags: FuseTag[] = labels.map((l: string) => 
        ({ value: l, normalized: diacritics.remove(l) }));

      return new Fuse<FuseTag>(tags, {
        keys: ['normalized'],
        shouldSort: true,
        threshold: SUGGEST_THRESHOLD
      })
    });

export const useTagSearch = (annotations: Annotation[], mode: 'FROM_ANNOTATIONS' | 'THESAURUS' = 'THESAURUS') => {

  const [tagIndex, setTagIndex] = useState<Fuse<FuseTag> | undefined>();

  const annotationsById = useMemo(() => 
      new Map(annotations.map(a => ([a.id, a]))), [annotations]);

  useEffect(() => {
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
  
      const tags: FuseTag[] = a.bodies
        .filter(b => b.purpose === 'tagging' && b.value)
        .map(b => ({ value: b.value!, normalized: diacritics.remove(b.value!) }));
  
      return { annotationId, tags };
    }).filter(d => d.tags.length > 0);

    return new Fuse<FuseAnnotationDocument>(documents, { 
      keys: ['tags.normalized'],
      shouldSort: true,
      threshold: 0
    });
  }, [annotations]);

  const search = (query: string, limit?: number): Annotation[] =>
    annotationIndex.search(diacritics.remove(query), { limit: limit || 500 })
      .map(r => annotationsById.get(r.item.annotationId)!)
      .filter(Boolean);

  const getSuggestions = (query: string, limit?: number): string[] => 
    tagIndex
     ? tagIndex.search(diacritics.remove(query), { limit: limit || 10 }).map(r => r.item.value)
     : [];

  return { search, getSuggestions };

}