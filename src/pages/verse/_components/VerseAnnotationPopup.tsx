import { useEffect, useMemo, useState } from 'react';
import { useSelection } from '@annotorious/react';
import type { TextAnnotation, TextSelector } from '@recogito/react-text-annotator';
import { AnnotationPopup } from '@components/AnnotationPopup';
import { getClosestRect, toClientRects } from '@lib/utils';
import {
  autoUpdate,
  flip,
  inline,
  offset,
  shift,
  useFloating
} from '@floating-ui/react';

import './VerseAnnotationPopup.css';

export const VerseAnnotationPopup = () => {

  const selection = useSelection();

  const selected: TextAnnotation | undefined = useMemo(() => (
    selection.selected.length > 0 
      ? selection.selected[0].annotation as TextAnnotation : undefined
  ), [selection.selected.map(s => s.annotation.id).join(',')]);
  
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
    if (selected) {
      const selector = selected.target.selector as (TextSelector | TextSelector[]);
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
  }, [selected, mousePos]);

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

  return (selected && isOpen) && (
    <div
      className="text-annotation-popup not-annotatable"
      ref={refs.setFloating}
      style={floatingStyles}>
      
      <AnnotationPopup 
        annotation={selected} />
    </div>
  )

}