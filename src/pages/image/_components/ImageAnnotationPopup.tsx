import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelection, useViewer, type ImageAnnotation } from '@annotorious/react';
import OpenSeadragon from 'openseadragon';
import { toClientRects } from '@lib/util';
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
import { AnnotationPopup } from '@components/AnnotationPopup';

const getAnnotationDomRect = (viewer: OpenSeadragon.Viewer, annotation: ImageAnnotation) => {
  // Annotation bounds (image coordinates)
  const { minX, minY, maxX, maxY } = annotation.target.selector.geometry.bounds;

  // Annotation bounding client rect corners
  const topLeft = viewer.viewport.imageToWindowCoordinates(new OpenSeadragon.Point(minX, minY));
  const bottomRight = viewer.viewport.imageToWindowCoordinates(new OpenSeadragon.Point(maxX, maxY));

  return new DOMRect(
    topLeft.x,
    topLeft.y,
    bottomRight.x  - topLeft.x,
    bottomRight.y - topLeft.y
  );
}

export const ImageAnnotationPopup = () => {

  const selection = useSelection();

  const selected: ImageAnnotation | undefined = useMemo(() => (
    selection.selected.length > 0 
      ? selection.selected[0].annotation as ImageAnnotation : undefined
  ), [selection.selected.map(s => s.annotation.id).join(',')]);

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
        padding: { right: 285, left: 5, top: 10, bottom: 10 }
      }),
      arrow({
        element: arrowRef,
        padding: 5
      })
    ],
    whileElementsMounted: autoUpdate
  });

  useEffect(() => {
    if (selected) {
      const setPosition = () => { 
        const rect = getAnnotationDomRect(viewer, selected);

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
  }, [selected, viewer]);

  return selected && isOpen && (
    <div
      className="annotation-popup image-annotation-popup"
      ref={refs.setFloating}
      style={floatingStyles}>
      <FloatingArrow ref={arrowRef} context={context} />

      <AnnotationPopup 
        annotation={selected} />
    </div>
  )

}