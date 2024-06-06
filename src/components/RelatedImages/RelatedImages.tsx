import { useLayoutEffect, useState } from 'react';
import type { Annotation } from '@annotorious/react';
import { animated, easings, useTransition } from 'react-spring';
import { X } from 'lucide-react';
import { getTags } from '@lib/utils';
import { Thumbnail } from './Thumbnail';
import type { RelatedImageAnnotation } from 'src/Types';

import './RelatedImages.css';

interface RelatedImagesProps {

  annotation?: Annotation;

  open?: boolean;

  related?: RelatedImageAnnotation[];

  onClose(): void;

}

export const RelatedImages = (props: RelatedImagesProps) => {

  const tags = props.annotation ? getTags(props.annotation) : [];

  const [mounted, setMounted] = useState(false);

  const transition = useTransition([props.open], {
    from: { width: mounted ? 0 : 300 },
    enter: { width: 300 },
    leave: { width: 0 },
    config:{
      duration: 150,
      easing: easings.easeInCubic
    }
  });

  useLayoutEffect(() => {
    setTimeout(() => setMounted(true), 1);
  }, []);

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