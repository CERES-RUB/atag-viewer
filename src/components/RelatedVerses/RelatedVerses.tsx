import { animated, easings, useTransition } from 'react-spring';
import type { RelatedVerseAnnotation } from 'src/Types';

import './RelatedVerses.css';

interface RelatedVersesProps {

  open?: boolean;

  related?: RelatedVerseAnnotation[];

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
    <animated.aside 
      style={style}
      className="related related-verses">
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
    </animated.aside>
  ))

}