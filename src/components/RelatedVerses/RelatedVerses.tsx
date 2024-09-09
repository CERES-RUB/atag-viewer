import { useLayoutEffect, useMemo, useState } from 'react';
import type { Annotation } from '@annotorious/react';
import { animated, easings, useTransition } from 'react-spring';
import { X } from 'lucide-react';
import { getTags, groupByOverlap } from '@lib/utils';
import { Snippet } from './Snippet';
import type { RelatedVerseAnnotation, Tag } from 'src/Types';

import './RelatedVerses.css';

interface RelatedVersesProps {

  annotation?: Annotation;

  currentSlug: string;

  open?: boolean;

  related?: RelatedVerseAnnotation[];

  onClose(): void;

}

export const RelatedVerses = (props: RelatedVersesProps) => {

  const [mounted, setMounted] = useState(false);

  const tags: Tag[] = useMemo(() =>
    props.annotation ? getTags(props.annotation) : [], [props.annotation]);

  const grouped = useMemo(() =>
    groupByOverlap<RelatedVerseAnnotation>(tags, props.related || []), [tags, props.related]);

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
    setTimeout(() => setMounted(true), 10);
  }, []);

  const getLink = (annotation: RelatedVerseAnnotation) => 
    annotation.slug === props.currentSlug
      ? `#${annotation.id.substring(annotation.id.lastIndexOf('/') + 1)}`
      : `/verse/${annotation.slug}/#${annotation.id.substring(annotation.id.lastIndexOf('/') + 1)}`;

  return transition((style, open) => open && (
    <animated.aside 
      style={style}
      className="related related-verses">
      <button 
        onClick={props.onClose}
        className="close">
        <X size={20} strokeWidth={1.5} />
      </button>

      <div className="related-verses-wrapper">
        <h3>
          Verses {props.annotation && `(${props.related ? props.related.length : 0})`}
        </h3>
        
        {props.annotation ? (
          <ul>
            {(grouped.map(group => group.related.map(({ annotation }) => (
              <li key={annotation.id}>
                <ul className="taglist">
                  {annotation.tags.map(t => (
                    <li 
                      key={t.id}
                      className={tags.some(tag => tag.id === t.id) ? 'common' : undefined}>{t.label}</li>
                  ))}
                </ul>

                {annotation.snippet && (
                  <p className="snippet-preview">
                    <Snippet 
                      value={annotation.snippet} 
                      href={getLink(annotation)} />
                  </p>
                )}

                <a href={getLink(annotation)}>
                  {annotation.verse}
                </a>
              </li>
            ))))}
          </ul>
        ) : (
          <div className="no-selection">
            No annotation selected.
          </div>
        )}
      </div>
    </animated.aside>
  ))

}