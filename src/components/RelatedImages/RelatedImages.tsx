import { animated, easings, useTransition } from 'react-spring';
import type { RelatedImageAnnotation } from 'src/Types';

import './RelatedImages.css';
import { Thumbnail } from './Thumbnail';

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

      <ul>
        {(props.related || []).map(r => (
          <li key={r.id}>
            <Thumbnail src={r.thumbnail} />
            {r.tags.map(t => (
              <span>{t}</span>
            ))}
            <a href="#">{r.image}</a>
          </li>
        ))}
      </ul>
    </animated.aside>
  ))

}