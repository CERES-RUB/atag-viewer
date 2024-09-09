import type { Annotation } from '@annotorious/react';
import type { RelatedAnnotation, RelatedAnnotationGroup, Tag } from 'src/Types';

export const getTags = (a: Annotation): Tag[] =>
  a.bodies.filter(b => b.purpose === 'tagging' && b.value && b.id).map(b => ({ id: b.id, label: b.value! }));

export const computeJaccardScore = (reference: Tag[], related: Tag[]) => {
  const referenceURIs = new Set(reference.map(r => r.id));
  const relatedURIs = related.map(r => r.id);

  const intersection = relatedURIs.filter(t => referenceURIs.has(t));
  const union = new Set([...reference, ...related]);
  return intersection.length / union.size;
}

export const groupByOverlap = <T extends RelatedAnnotation>(reference: Tag[], related: T[]) => {
  // Shorthand
  const equal = (a: Tag[], b: Tag[]) =>
    a.length === b.length && a.every(tag => b.some(t => t.id === tag.id));

  // Helper
  const sortGroups = (grouped: RelatedAnnotationGroup[]) => {
    // Sort groups by amount of overlap (= no. of common tags)
    grouped.sort((a, b) => b.common.length - a.common.length);
  
    // Sort annotations by Jaccard score
    grouped.forEach(group =>
      group.related.sort((a, b) => b.score - a.score));
  };

  const grouped: RelatedAnnotationGroup<T>[] = [];

  related.forEach(r => {
    const commonTags = r.tags.filter(tag => reference.some(t => t.id === tag.id));

    const jaccard = computeJaccardScore(reference, r.tags);

    const group = grouped.find(({ common }) => equal(common, commonTags));
    if (group) {
      group.related = [...group.related, { annotation: r, score: jaccard }];
    } else {
      grouped.push({ common: commonTags, related: [{ annotation: r, score: jaccard }] });
    }
  });

  // Sort in place
  sortGroups(grouped);

  return grouped;
}