import { animated, easings, useTransition } from 'react-spring';
import type { RelatedImageAnnotation } from 'src/Types';

import './RelatedImages.css';

interface RelatedImagesProps {

  open?: boolean;

  related?: RelatedImageAnnotation[];

}

export const RelatedImages = (props: RelatedImagesProps) => {

  const transition = useTransition([props.open], {
    from: { width: 0 },
    enter: { width: 300 },
    leave: { width: 0 },
    config:{
      duration: 150,
      easing: easings.easeInCubic
    }
  });

  return transition((style, open) => open && (
    <animated.aside 
      style={style}
      className="related related-images">
      Images
      {props.related && (<span>{JSON.stringify(props.related)}</span>)}
    </animated.aside>
  ))

}