import { useLayoutEffect, useMemo, useState } from 'react';
import type { Annotation } from '@annotorious/react';
import { animated, easings, useTransition } from 'react-spring';
import { X } from 'lucide-react';
import { getTags, groupByOverlap } from '@lib/utils';
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

  const [mounted, setMounted] = useState(false);

  const tags: Set<string> = useMemo(() =>
    props.annotation ? new Set(getTags(props.annotation)) : new Set(), [props.annotation]);

  const grouped = useMemo(() =>
    groupByOverlap<RelatedImageAnnotation>(tags, props.related || []), [tags, props.related]);

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

      <div className="related-verses-wrapper">
        <h3>Images ({props.related ? props.related.length : 0})</h3>

        <ul>
          {(grouped.map(group => group.related.map(({ annotation }) => (
            <li key={annotation.id}>
              <div className="preview">
                <Thumbnail src={annotation.thumbnail} />

                <div className="taglist-wrapper">
                  <ul className="taglist">
                    {annotation.tags.map(t => (
                      <li 
                        key={t}
                        className={tags.has(t) ? 'common' : undefined}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <a href={`/image/${annotation.slug}#${annotation.id.substring(annotation.id.lastIndexOf('/') + 1)}`}>
                {annotation.image}
              </a>
            </li>
          ))))}
        </ul>
      </div>
    </animated.aside>
  ))

}