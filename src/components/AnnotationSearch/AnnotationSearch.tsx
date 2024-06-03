import { useEffect, useState } from 'react';
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

  const annotations = useAnnotations<Annotation>();

  const { search, getSuggestions } = useTagSearch(annotations);

  const [query, setQuery] = useState('');

  const [hits, setHits] = useState<Annotation[]>([])

  useEffect(() => {
    const hits = search(query);
    setHits(hits);

    props.onSearch(hits);
  }, [query]);

  return (
    <div className="annotation-search">
      <Autosuggest 
        placeholder="Search"
        value={query} 
        onChange={setQuery}
        getSuggestions={getSuggestions} />
        
      <Search size={20} />

      <div className="collapsible">
        <div className="result-count">
          1/{hits.length}
        </div>

        <div className="actions">
          <ChevronUp size={18}  />
          <ChevronDown size={18} />
          <X size={18} strokeWidth={2.2} />
        </div>
      </div>
    </div>
  )

}