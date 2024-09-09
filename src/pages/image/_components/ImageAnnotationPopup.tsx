import { useEffect, useRef, useState } from 'react';
import OpenSeadragon from 'openseadragon';
import { useViewer } from '@annotorious/react';
import type { ImageAnnotation } from '@annotorious/react';
import { AnnotationPopup } from '@components/AnnotationPopup';
import { toClientRects } from '@lib/utils';
import type { RelatedImageAnnotation, RelatedVerseAnnotation } from 'src/Types';
import {
  useFloating,
  arrow,
  shift,
  inline,
  autoUpdate,
  flip,
  offset,
  FloatingArrow
} from '@floating-ui/react';

import './ImageAnnotationPopup.css';

const getAnnotationDomRect = (viewer: OpenSeadragon.Viewer, annotation: ImageAnnotation) => {
  const { minX, minY, maxX, maxY } = annotation.target.selector.geometry.bounds;

  const topLeft = viewer.viewport.imageToWindowCoordinates(new OpenSeadragon.Point(minX, minY));
  const bottomRight = viewer.viewport.imageToWindowCoordinates(new OpenSeadragon.Point(maxX, maxY));

  return new DOMRect(
    topLeft.x,
    topLeft.y,
    bottomRight.x  - topLeft.x,
    bottomRight.y - topLeft.y
  );
}

interface ImageAnnotationPopupProps {

  annotation?: ImageAnnotation;

  relatedImages?: RelatedImageAnnotation[];

  relatedVerses?: RelatedVerseAnnotation[];

  onClickImages(): void;

  onClickVerses(): void;

}

export const ImageAnnotationPopup = (props: ImageAnnotationPopupProps) => {

  const [isOpen, setIsOpen] = useState(false);

  const viewer = useViewer();

  const arrowRef = useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      inline(), 
      offset(10),
      flip({ crossAxis: true }),
      shift({ 
        crossAxis: true,
        boundary: viewer?.element,
        padding: { right: 5, left: 5, top: 10, bottom: 10 }
      }),
      arrow({
        element: arrowRef,
        padding: 5
      })
    ],
    whileElementsMounted: autoUpdate
  });

  useEffect(() => {
    const { annotation } = props;
    
    if (annotation) {
      const setPosition = () => { 
        const rect = getAnnotationDomRect(viewer, annotation);
        
        refs.setReference({
          getBoundingClientRect: () => rect,
          getClientRects: () => toClientRects(rect)
        });
      }

      setPosition();

      viewer.addHandler('update-viewport', setPosition);

      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [props.annotation, viewer]);

  return (props.annotation && isOpen) && (
    <div
      className="image-annotation-popup"
      ref={refs.setFloating}
      style={floatingStyles}>
      <FloatingArrow 
        ref={arrowRef} 
        context={context} 
        fill="#fff" />

      <AnnotationPopup 
        type="IMAGE"
        annotation={props.annotation}
        relatedImages={props.relatedImages || []} 
        relatedVerses={props.relatedVerses || []}
        onClickImages={props.onClickImages}
        onClickVerses={props.onClickVerses} />
    </div>
  )

}