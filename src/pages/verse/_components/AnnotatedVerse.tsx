import { useCallback, useEffect } from 'react';
import { useAnnotator } from '@annotorious/react';
import type { Annotation, W3CAnnotation } from '@annotorious/react';
import { TextAnnotator, W3CTextFormat, type HighlightStyle } from '@recogito/react-text-annotator';
import { VerseAnnotationPopup } from './VerseAnnotationPopup';
import type { ThesaurusTerm } from 'src/Types';

import './AnnotatedVerse.css';
import '@recogito/react-text-annotator/react-text-annotator.css';

interface AnnotatedVerseProps {

  verse: string;

  narrativeTerms: ThesaurusTerm[];

  annotations: W3CAnnotation[];

  searchResults: Annotation[];

}

export const AnnotatedVerse = (props: AnnotatedVerseProps) => {

  const anno = useAnnotator();

  const narrative = new Set(props.narrativeTerms.map(t => t.prefLabel));

  const style = useCallback((a: Annotation) => {
    const isSection = a.bodies.find(b => b.value && narrative.has(b.value));

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