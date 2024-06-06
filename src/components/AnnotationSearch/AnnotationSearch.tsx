import { useEffect, useState } from 'react';
import { animated, easings, useTransition } from 'react-spring';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import { useAnnotations } from '@annotorious/react';
import type { Annotation } from '@annotorious/react';
import { Autosuggest } from '@components/Autosuggest';
import { useTagSearch } from './useTagSearch';

import './AnnotationSearch.css';

interface AnnotationSearchProps {

  onClear(): void;

  onHighlightResult(a: Annotation): void;

  onSearch(hits: Annotation[]): void;

}

export const AnnotationSearch = (props: AnnotationSearchProps) => {

  const annotations = useAnnotations<Annotation>();

  const [isCollapsed, setIsCollapsed] = useState(true);

  const { search, getSuggestions } = useTagSearch(annotations);

  const [query, setQuery] = useState('');

  const [hits, setHits] = useState<Annotation[] |  undefined>();

  const [highlightedIdx, setHighlightedIdx] = useState(0);

  const transition = useTransition([isCollapsed], {
    from: { maxWidth: 0, opacity: 0 },
    enter: { maxWidth: 120, opacity: 1 },
    leave: { maxWidth: 0, opacity: 1 },
    config:{
      duration: 250,
      easing: easings.easeInOutCubic
    }
  });

  useEffect(() => {
    if (!query) return;

    const hits = search(query);

    setHits(hits);

    if (hits.length > 0)
      setHighlightedIdx(1);
    else
      setHighlightedIdx(0);

    props.onSearch(hits);
  }, [query]);

  useEffect(() => {
    if (!highlightedIdx || !hits) return;

    const annotation = hits[highlightedIdx - 1];
    props.onHighlightResult(annotation);
  }, [hits, highlightedIdx]);

  const onStep = (inc: number) => () => {
    if (!hits) return;

    const nextIndex = 
      Math.min(Math.max(1, highlightedIdx + inc), hits.length);

    setHighlightedIdx(nextIndex);
  }

  const onClearSearch = () => {
    setQuery('');
    setHits(undefined);
    setHighlightedIdx(0);
    setIsCollapsed(true);

    props.onClear();
  }

  return (
    <div className="annotation-search">
      <Search size={20} />
      
      <div className="searchbox-wrapper">
        <Autosuggest 
          placeholder="Search"
          value={query} 
          onChange={setQuery}
          onFocus={() => setIsCollapsed(false)}
          getSuggestions={getSuggestions} />  

        {hits && (
          <div className="result-count">
            {highlightedIdx}/{hits.length}
          </div>
        )}
      </div>

      {transition((style, collapsed) => !collapsed && (    
        <animated.div style={style} className="collapsible">
          <div className="actions">
            <button onClick={onStep(-1)}>
              <ChevronUp size={18}  />
            </button>

            <button onClick={onStep(1)}>
              <ChevronDown size={18} />
            </button>
            
            <button onClick={onClearSearch}>
              <X size={18} strokeWidth={2.2} />
            </button>
          </div>
        </animated.div>
      ))}
    </div>
  )

}