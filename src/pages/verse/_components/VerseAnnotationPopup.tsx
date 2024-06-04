import { useEffect, useState } from 'react';
import type { TextAnnotation, TextSelector } from '@recogito/react-text-annotator';
import { AnnotationPopup } from '@components/AnnotationPopup';
import { getClosestRect, toClientRects } from '@lib/utils';
import type { RelatedImageAnnotation, RelatedVerseAnnotation } from 'src/Types';
import {
  autoUpdate,
  flip,
  inline,
  offset,
  shift,
  useFloating
} from '@floating-ui/react';

import './VerseAnnotationPopup.css';

interface VerseAnnotationPopup {

  annotation?: TextAnnotation;

  relatedImages?: RelatedImageAnnotation[];

  relatedVerses?: RelatedVerseAnnotation[];

}

export const VerseAnnotationPopup = (props: VerseAnnotationPopup) => {
  
  const [mousePos, setMousePos] = useState<{ x: number, y: number } | undefined>();

  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles } = useFloating({
    placement: 'bottom',
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(4), 
      inline(), 
      flip(), 
      shift({
        crossAxis: true,
        padding: { top: 5, bottom: 5 }
      })],
    whileElementsMounted: autoUpdate
  });

  useEffect(() => {
    if (props.annotation) {
      const selector = props.annotation.target.selector as (TextSelector | TextSelector[]);
      const range = Array.isArray(selector) ? selector[0].range : selector.range; 

      if (range && !range.collapsed) {
        refs.setReference({
          getBoundingClientRect: () => {
            return range.getBoundingClientRect();
          },
          getClientRects: () => { 
            const rect = mousePos 
              ? getClosestRect(range.getClientRects(), mousePos)
              : range.getClientRects()[0];

            return toClientRects(rect);
          }
        });

        setIsOpen(true);
      }
    } else {
      setIsOpen(false);
    }
  }, [props.annotation, mousePos]);

  useEffect(() => {
    const onPointerUp = (event: PointerEvent) => {
      const { clientX, clientY } = event;
      setMousePos({ x: clientX, y: clientY });
    }

    window.document.addEventListener('pointerup', onPointerUp);

    return () => {
      window.document.removeEventListener('pointerup', onPointerUp);
    }
  }, []);

  return (props.annotation && isOpen) && (
    <div
      className="text-annotation-popup not-annotatable"
      ref={refs.setFloating}
      style={floatingStyles}>
      
      <AnnotationPopup 
        annotation={props.annotation} 
        relatedImages={props.relatedImages || []} 
        relatedVerses={props.relatedVerses || []}/>
    </div>
  )

}