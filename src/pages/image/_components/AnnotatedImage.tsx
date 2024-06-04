import { useEffect, useMemo } from 'react';
import { useRelated, useSelected } from '@lib/hooks';
import { ImageAnnotationPopup } from './ImageAnnotationPopup';
import type { Selected } from 'src/Types';
import {
  OpenSeadragonAnnotator, 
  OpenSeadragonViewer, 
  PointerSelectAction, 
  W3CImageFormat, 
  useAnnotator,
  useSelection
} from '@annotorious/react';
import type {
  AnnotationState,
  DrawingStyleExpression,
  DrawingStyle,
  ImageAnnotation,
  W3CImageAnnotation,
  Annotation
} from '@annotorious/react';

import './AnnotatedImage.css';
import '@annotorious/react/annotorious-react.css';

interface AnnotatedImageProps {

  isRelatedImagesOpen: boolean;
  
  isRelatedVersesOpen: boolean;

  annotations: W3CImageAnnotation[];

  imageManifest: string;

  searchResults: Annotation[];

  onSelect(selected: Selected): void;

  onOpenRelatedImages(): void;

  onOpenRelatedVerses(): void;

}

const BASE_STYLE: DrawingStyleExpression<ImageAnnotation> = (a: ImageAnnotation, state?: AnnotationState) => ({
  fill: state?.selected ? '#ff0000' : '#ffffff',
  fillOpacity: (state?.hovered || state?.selected) ? 0.25 : 0.1,
  stroke: state?.selected ? '#ff0000' : '#ffffff',
  strokeOpacity: (state?.hovered || state?.selected) ? 0.9 : 0.35,
  strokeWidth: (state?.hovered || state?.selected) ? 1 : 0
} as DrawingStyle);

export const AnnotatedImage = (props: AnnotatedImageProps) => {

  const anno = useAnnotator();

  const selected = useSelected<ImageAnnotation>();

  const { images, verses } = useRelated(selected);

  const options = useMemo(() => ({
    prefixUrl: 'https://cdn.jsdelivr.net/npm/openseadragon@3.1/build/openseadragon/images/',
    tileSources: props.imageManifest,
    gestureSettingsMouse: {
      clickToZoom: false
    },
    maxZoomLevel: 4,
    minZoomLevel: 0.25
  }), [props.imageManifest]);

  useEffect(() => {
    if (!anno || !props.annotations) return;

    anno.setAnnotations(props.annotations);
  }, [anno, props.annotations]);

  const style = useMemo(() => {
    if (props.searchResults.length === 0) {
      return BASE_STYLE;
    } else {
      const highlighted = new Set(props.searchResults.map(a => a.id));

      const style: DrawingStyleExpression<ImageAnnotation> = (a, _) => ({
        fill: highlighted.has(a.id) ? '#ffff00' : '#ffffff',
        fillOpacity: highlighted.has(a.id) ? 0.25 : 0.1,
        strokeOpacity: highlighted.has(a.id) ? 0.9 : 0.1
      });

      return style;
    }
  }, [props.searchResults]);

  const marginRight = useMemo(() => (
    (props.isRelatedImagesOpen && props.isRelatedVersesOpen) ? 600 :
    (props.isRelatedImagesOpen || props.isRelatedVersesOpen) ? 300 :
    0
  ), [props.isRelatedImagesOpen, props.isRelatedVersesOpen])

  return (
    <OpenSeadragonAnnotator 
      adapter={W3CImageFormat(props.imageManifest)}
      drawingEnabled={false}
      pointerSelectAction={PointerSelectAction.SELECT}
      style={style}>
            
      <OpenSeadragonViewer className="openseadragon" options={options} />

      <ImageAnnotationPopup 
        marginRight={marginRight}
        annotation={selected} 
        relatedImages={images} 
        relatedVerses={verses} 
        onClickImages={props.onOpenRelatedImages}
        onClickVerses={props.onOpenRelatedVerses} />
    </OpenSeadragonAnnotator>
  )

}