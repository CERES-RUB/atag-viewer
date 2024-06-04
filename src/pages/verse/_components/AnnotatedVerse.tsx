import { useCallback, useEffect, useMemo } from 'react';
import { useAnnotator, useSelection } from '@annotorious/react';
import type { Annotation, W3CAnnotation } from '@annotorious/react';
import { TextAnnotator, W3CTextFormat } from '@recogito/react-text-annotator';
import type { HighlightStyle, TextAnnotation } from '@recogito/react-text-annotator';
import { useRelated, useSelected } from '@lib/hooks';
import { useNarrativeTerms } from '../_hooks';
import { VerseAnnotationPopup } from './VerseAnnotationPopup';
import type { Selected } from 'src/Types';

import './AnnotatedVerse.css';
import '@recogito/react-text-annotator/react-text-annotator.css';

interface AnnotatedVerseProps {

  verse: string;

  annotations: W3CAnnotation[];

  searchResults: Annotation[];

  onSelect(selected: Selected): void;

  onOpenRelatedImages(): void;

  onOpenRelatedVerses(): void;

}

export const AnnotatedVerse = (props: AnnotatedVerseProps) => {

  const anno = useAnnotator();

  const selected = useSelected<TextAnnotation>();

  const { images, verses } = useRelated(selected);

  const narrative = useNarrativeTerms();

  const style = useCallback((a: Annotation) => {
    const isSection = a.bodies.find(b => b.value && narrative!.has(b.value));

    return isSection ? {
      fill: '#000',
      fillOpacity: 0.05
    } as HighlightStyle : {
      fill: '#ff5e5e',
      fillOpacity: 0.4,
      underlineThickness: 2,
      underlineColor: '#e05252'
    } as HighlightStyle;
  }, [narrative]);

  useEffect(() => {
    if (!anno) return;
    anno.setAnnotations(props.annotations);
  }, [anno, props.annotations]);

  useEffect(() => {
    props.onSelect({ 
      annotation: selected, 
      relatedImages: images, 
      relatedVerses: verses
    });
  }, [selected, images, verses]);

  return narrative && (
    <TextAnnotator
      adapter={container => W3CTextFormat('5db80aa5-8a27-4539-aeb3-bddf3abc0098', container)}
      annotationEnabled={false}
      style={style}>
      
      <div className="annotated-text">
        {props.verse}
      </div>

      <VerseAnnotationPopup 
        annotation={selected} 
        relatedImages={images} 
        relatedVerses={verses} 
        onClickImages={props.onOpenRelatedImages}
        onClickVerses={props.onOpenRelatedVerses} />
    </TextAnnotator>
  )

}