import { animated, easings, useTransition } from 'react-spring';

interface RelatedVersesProps {

  open?: boolean;

}

export const RelatedVerses = (props: RelatedVersesProps) => {

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
      Verses
    </animated.aside>
  ))

}