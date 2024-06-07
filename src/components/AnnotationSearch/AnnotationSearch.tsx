import { useEffect, useState } from 'react';
import { animated, easings, useTransition } from 'react-spring';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import { useAnnotations } from '@annotorious/react';
import type { Annotation } from '@annotorious/react';
import { Autosuggest } from '@components/Autosuggest';
import { useTagSearch } from './useTagSearch';

import './AnnotationSearch.css';

interface AnnotationSearchProps {

  sorter?(a: Annotation, b: Annotation): number;

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

  // The first enter on the autocomplete closes the suggestions panel,
  // but we want to skip to next for all subsequent Enter events
  const [shouldStepOnEnter, setShouldStepOnEnter] = useState(false);

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
    if (query) {
      const hits = search(query);

      if (props.sorter)
        hits.sort(props.sorter);

      setHits(hits);

      if (hits.length > 0)
        setHighlightedIdx(1);
      else
        setHighlightedIdx(0);

      props.onSearch(hits);
    } else {
      setHits(undefined);
      setHighlightedIdx(1);

      props.onSearch([]);
    }
  }, [query, props.sorter]);

  useEffect(() => {
    if (!highlightedIdx || !hits) return;

    const annotation = hits[highlightedIdx - 1];
    props.onHighlightResult(annotation);
  }, [hits, highlightedIdx]);

  const onStep = (inc: number) => {
    if (!hits) return;

    const nextIndex = 
      Math.min(Math.max(1, highlightedIdx + inc), hits.length);

    setHighlightedIdx(nextIndex);
  }

  const onClearSearch = () => {
    setQuery('');
    setHits(undefined);
    setHighlightedIdx(1);
    setIsCollapsed(true);

    props.onClear();
  }

  const onKeyDown = (evt: React.KeyboardEvent) => {
    if (evt.key === 'Enter') {
      if (shouldStepOnEnter) {
        onStep(1);
      } else {
        setShouldStepOnEnter(true);
      }
    } else {
      // Any other key: reset
      setShouldStepOnEnter(false);
    }
  }

  const onBlur = () => {
    // Close the search input on blur - if there's no query!
    if (!query) setIsCollapsed(true);
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
          onBlur={onBlur}
          onKeyDown={onKeyDown}
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
            <button onClick={() => onStep(-1)}>
              <ChevronUp size={18}  />
            </button>

            <button onClick={() => onStep(1)}>
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