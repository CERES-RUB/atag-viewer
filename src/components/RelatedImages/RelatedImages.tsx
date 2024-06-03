import { animated, easings, useTransition } from 'react-spring';

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
    <animated.aside style={style}>
      Images
    </animated.aside>
  ))

}