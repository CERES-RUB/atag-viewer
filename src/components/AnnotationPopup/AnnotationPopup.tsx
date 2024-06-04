import { useMemo } from 'react';
import type { Annotation } from '@annotorious/react';
import type { RelatedAnnotation } from 'src/Types';

import './AnnotationPopup.css';

interface AnnotationPopupProps {

  annotation: Annotation;

  related: RelatedAnnotation[];

}

export const AnnotationPopup = (props: AnnotationPopupProps) => {

  const tags = useMemo(() => (
    props.annotation.bodies.filter(b => b.purpose === 'tagging')
  ), [props.annotation]);

  return (
    <div className="annotation-popup">
      <div className="tags">
        <div>{tags.map(t => t.value).join(' · ')}</div>
        
        <div className="related">
          <button>4 other verses</button> · <button>2 images</button>
        </div>
      </div>
    </div>
  )

}