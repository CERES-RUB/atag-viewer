import { animated, easings, useTransition } from 'react-spring';

import './RelatedImages.css';

interface RelatedImagesProps {

  open?: boolean;

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
    </animated.aside>
  ))

}