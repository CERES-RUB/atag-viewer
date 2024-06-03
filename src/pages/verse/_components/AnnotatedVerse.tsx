import { useCallback, useEffect } from 'react';
import { useAnnotator } from '@annotorious/react';
import type { Annotation, W3CAnnotation } from '@annotorious/react';
import { TextAnnotator, W3CTextFormat, type HighlightStyle } from '@recogito/react-text-annotator';

import './AnnotatedVerse.css';
import '@recogito/react-text-annotator/react-text-annotator.css';
import { VerseAnnotationPopup } from './VerseAnnotationPopup';

const VERSE_TAGS = new Set([
  'first meditation',
  'encounter with a mendicant',
  'the bodhisattva watching sleeping women'
]);

interface AnnotatedVerseProps {

  verse: string;

  annotations: W3CAnnotation[];

  searchResults: Annotation[];

}

export const AnnotatedVerse = (props: AnnotatedVerseProps) => {

  const anno = useAnnotator();

  const style = useCallback((a: Annotation) => {
    const isSection = a.bodies.find(b => b.value && VERSE_TAGS.has(b.value));

    return isSection ? {
      fill: '#000',
      fillOpacity: 0.05
    } as HighlightStyle : {
      fill: '#ff5e5e',
      fillOpacity: 0.4,
      underlineThickness: 2,
      underlineColor: '#e05252'
    } as HighlightStyle;
  }, []);

  useEffect(() => {
    if (!anno) return;
    anno.setAnnotations(props.annotations);
  }, [anno, props.annotations])

  return (
    <TextAnnotator
      adapter={container => W3CTextFormat('5db80aa5-8a27-4539-aeb3-bddf3abc0098', container)}
      annotationEnabled={false}
      style={style}>
      
      <div className="annotated-text">
        {props.verse}
      </div>

      <VerseAnnotationPopup />
    </TextAnnotator>
  )

}