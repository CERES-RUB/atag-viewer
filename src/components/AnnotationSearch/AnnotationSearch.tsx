import { useEffect, useState } from 'react';
import { animated, easings, useTransition } from 'react-spring';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import { useAnnotations } from '@annotorious/react';
import type { Annotation } from '@annotorious/react';
import { Autosuggest } from '@components/Autosuggest';
import { useTagSearch } from './useTagSearch';

import './AnnotationSearch.css';

interface AnnotationSearchProps {

  onSearch(hits: Annotation[]): void;

}

export const AnnotationSearch = (props: AnnotationSearchProps) => {

  const [isCollapsed, setIsCollapsed] = useState(false);

  const annotations = useAnnotations<Annotation>();

  const { search, getSuggestions } = useTagSearch(annotations);

  const [query, setQuery] = useState('');

  const [hits, setHits] = useState<Annotation[]>([]);

  const transition = useTransition([isCollapsed], {
    from: { maxWidth: 0, opacity: 0 },
    enter: { maxWidth: 300, opacity: 1 },
    leave: { maxWidth: 0, opacity: 1 },
    config:{
      duration: 150,
      easing: easings.easeInCubic
    }
  });

  useEffect(() => {
    const hits = search(query);
    setHits(hits);

    props.onSearch(hits);
  }, [query]);

  return (
    <div className="annotation-search">
      <Search size={20} />
      
      <Autosuggest 
        placeholder="Search"
        value={query} 
        onBlur={() => setIsCollapsed(true)}
        onChange={setQuery}
        onFocus={() => setIsCollapsed(false)}
        getSuggestions={getSuggestions} />  


      {transition((style, collapsed) => !collapsed && (    
        <animated.div style={style} className="collapsible">
          <div className="result-count">
            1/{hits.length}
          </div>

          <div className="actions">
            <ChevronUp size={18}  />
            <ChevronDown size={18} />
            <X size={18} strokeWidth={2.2} />
          </div>
        </animated.div>
      ))}
    </div>
  )

}