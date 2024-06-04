import { useMemo } from 'react';
import type { Annotation } from '@annotorious/react';
import type { RelatedImageAnnotation, RelatedVerseAnnotation } from 'src/Types';

import './AnnotationPopup.css';

interface AnnotationPopupProps {

  annotation: Annotation;

  relatedImages: RelatedImageAnnotation[];

  relatedVerses: RelatedVerseAnnotation[];

  type: 'IMAGE' | 'VERSE';

  onClickImages(): void;

  onClickVerses(): void;

}

export const AnnotationPopup = (props: AnnotationPopupProps) => {

  const images = props.relatedImages.length;

  const verses = props.relatedVerses.length;

  const tags = useMemo(() => (
    props.annotation.bodies.filter(b => b.purpose === 'tagging')
  ), [props.annotation]);

  return (
    <div className="annotation-popup">
      <div className="tags">
        <div>{tags.map(t => t.value).join(' · ')}</div>
        
        {props.type === 'VERSE' ? (
          <div className="related">
            {verses > 0 && (
              <button onClick={props.onClickVerses}>
                <span>{verses} other verse{verses > 1 && 's'}</span>
              </button> 
            )}

            {images > 0 && (
              <button onClick={props.onClickImages}>
                <span>{images} image{images > 1 && 's'}</span>
              </button> 
            )}
          </div>
        ) : (
          <div className="related">
            {images > 0 && ( 
              <button onClick={props.onClickImages}>
                <span>{images} other image{images > 1 && 's'}</span>
              </button>
            )}

            {verses > 0 && (
              <button onClick={props.onClickVerses}>
                <span>{verses} verse{verses > 1 && 's'}</span>
              </button> 
            )}
          </div>
        )}
      </div>
    </div>
  )

}