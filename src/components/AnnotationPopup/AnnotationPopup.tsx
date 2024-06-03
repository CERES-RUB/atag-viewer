import { useMemo } from 'react';
import type { Annotation } from '@annotorious/react';

interface AnnotationPopupProps {

  annotation: Annotation;

}

export const AnnotationPopup = (props: AnnotationPopupProps) => {

  const tags = useMemo(() => (
    props.annotation.bodies.filter(b => b.purpose === 'tagging')
  ), [props.annotation]);

  return (
    <div>
      <div className="tag">
        <div>{tags.map(t => t.value).join(' · ')}</div>
        
        <div className="related">
          <div className="related-images">
            <button 
              >4 other verses</button> · <button 
              >2 images</button>
          </div>
        </div>
      </div>
    </div>
  )

}