import type { Annotation } from '@annotorious/react';
import type { RelatedAnnotation, RelatedAnnotationGroup } from 'src/Types';

export const getTags = (a: Annotation) =>
  a.bodies.filter(b => b.purpose === 'tagging' && b.value).map(b => b.value!);

export const computeJaccardScore = (reference: Set<string>, related: Set<string>) => {
  const intersection = Array.from(related).filter(t => reference.has(t));
  const union = new Set([...reference, ...related]);
  return intersection.length / union.size;
}

export const groupByOverlap = (reference: Set<string>, related: RelatedAnnotation[]) => {
  // Shorthand
  const equal = (a: Set<string>, b: Set<string>) =>
    a.size === b.size && [...a].every(value => b.has(value));

  // Helper
  const sortGroups = (grouped: RelatedAnnotationGroup[]) => {
    // Sort groups by amount of overlap (= no. of common tags)
    grouped.sort((a, b) => b.common.size - a.common.size);
  
    // Sort annotations by Jaccard score
    grouped.forEach(group =>
      group.related.sort((a, b) => b.score - a.score));
  };

  const grouped: RelatedAnnotationGroup[] = [];

  related.forEach(r => {
    const tags = new Set(r.tags);

    const commonTags = new Set(Array.from(tags).filter(tag => reference.has(tag)));

    const jaccard = computeJaccardScore(reference, tags);

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