import { useLayoutEffect, useState } from 'react';
import type { Annotation } from '@annotorious/react';
import { animated, easings, useTransition } from 'react-spring';
import { X } from 'lucide-react';
import { getTags } from '@lib/utils';
import type { RelatedVerseAnnotation } from 'src/Types';

import './RelatedVerses.css';

interface RelatedVersesProps {

  annotation?: Annotation;

  open?: boolean;

  related?: RelatedVerseAnnotation[];

  onClose(): void;

}

export const RelatedVerses = (props: RelatedVersesProps) => {

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
    setTimeout(() => setMounted(true), 10);
  }, []);

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
        <h3>Verses ({props.related ? props.related.length : 0})</h3>
        
        <ul>
          {(props.related || []).map(r => (
            <li key={r.id}>
              <ul className="taglist">
                {r.tags.map(t => (
                  <li key={t}>{t}</li>
                ))}
              </ul>

              <p className="snippet-preview">{r.snippet}</p>

              <a href={`/verse/${r.slug}#${r.id.substring(r.id.lastIndexOf('/') + 1)}`}>{r.verse}</a>
            </li>
          ))}
        </ul>
      </div>
    </animated.aside>
  ))

}