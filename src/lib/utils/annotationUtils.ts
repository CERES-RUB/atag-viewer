import type { Annotation } from '@annotorious/react';

export const getTags = (a: Annotation) =>
  a.bodies.filter(b => b.purpose === 'tagging' && b.value).map(b => b.value!);