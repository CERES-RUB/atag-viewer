import { useCallback, useEffect } from 'react';
import { useAnnotator } from '@annotorious/react';
import type { Annotation, AnnotationState, Color } from '@annotorious/react';
import { TextAnnotator, W3CTextFormat } from '@recogito/react-text-annotator';
import type { HighlightStyle, RecogitoTextAnnotator, TextAnnotation, W3CTextAnnotation } from '@recogito/react-text-annotator';
import { useRelated, useSelected } from '@lib/hooks';
import { useNarrativeTerms } from '../_hooks';
import { Categorical } from './Colors';
import { VerseAnnotationPopup } from './VerseAnnotationPopup';
import type { Selected } from 'src/Types';

import './AnnotatedVerse.css';
import '@recogito/react-text-annotator/react-text-annotator.css';

interface AnnotatedVerseProps {

  annotations: W3CTextAnnotation[];

  highlightedSearchResult?: TextAnnotation;

  searchResults: Annotation[];

  verse: string;

  onSelect(selected: Selected): void;

  onOpenRelatedImages(): void;

  onOpenRelatedVerses(): void;

}

const BASE_SECTION_STYLE = (z?: number): HighlightStyle  => ({
  fill: '#000',
  fillOpacity: 0.05,
  underlineThickness: 1.5,
  underlineColor: Categorical[z || 0] as Color, //  'rgba(0, 0, 0, 0.4)',
  underlineOffset: 3 * (z || 0)  + 1
});

const BASE_TAG_STYLE = (z?: number): HighlightStyle => ({
  fill: '#ff5e5e',
  fillOpacity: 0.4,
  underlineThickness: 2,
  underlineColor: '#e05252',
  underlineOffset: 3 * (z || 0)  + 1
});

export const AnnotatedVerse = (props: AnnotatedVerseProps) => {

  const { searchResults, highlightedSearchResult } = props;

  const anno = useAnnotator<RecogitoTextAnnotator<TextAnnotation, W3CTextAnnotation>>();

  const selected = useSelected<TextAnnotation>();

  const { images, verses } = useRelated(selected);

  const narrative = useNarrativeTerms();

  const style = useCallback((a: TextAnnotation, state: AnnotationState, z?: number) => {
    const isSection = a.bodies.find(b => b.id && narrative!.has(b.id));

    const baseStyle = isSection ? BASE_SECTION_STYLE(z) : BASE_TAG_STYLE(z);

    if (searchResults.length === 0) {
      return baseStyle;
    } else {  
      const resultIds = new Set(searchResults.map(a => a.id));

      return resultIds.has(a.id) ? {
        ...baseStyle,
        fill: '#fff800',
        underlineColor: '#caca2b'
      } as HighlightStyle : baseStyle;
    }
  }, [narrative, searchResults, highlightedSearchResult]);

  useEffect(() => {
    if (!anno) return;
      anno.setAnnotations(props.annotations);
  }, [anno, props.annotations]);

  useEffect(() => {
    if (props.highlightedSearchResult) {
      anno.setSelected(props.highlightedSearchResult.id);
      anno.scrollIntoView(props.highlightedSearchResult);
    }
  }, [props.highlightedSearchResult]);

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
      annotatingEnabled={false}
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