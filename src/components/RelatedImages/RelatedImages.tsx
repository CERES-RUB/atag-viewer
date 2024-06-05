import { animated, easings, useTransition } from 'react-spring';
import { X } from 'lucide-react';
import { Thumbnail } from './Thumbnail';
import type { RelatedImageAnnotation } from 'src/Types';

import './RelatedImages.css';

interface RelatedImagesProps {

  open?: boolean;

  related?: RelatedImageAnnotation[];

  onClose(): void;

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
      <button 
        onClick={props.onClose}
        className="close">
        <X size={20} strokeWidth={1.5} />
      </button>

      <h3>Images ({props.related ? props.related.length : 0})</h3>

      <ul>
        {(props.related || []).map(r => (
          <li key={r.id}>
            <Thumbnail src={r.thumbnail} />
            {r.tags.map(t => (
              <span key={t}>{t}</span>
            ))}
            <a href={`/image/${r.slug}#${r.id.substring(r.id.lastIndexOf('/') + 1)}`}>{r.image}</a>
          </li>
        ))}
      </ul>
    </animated.aside>
  ))

}