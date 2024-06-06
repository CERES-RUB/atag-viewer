import { useEffect, useState } from 'react';
import { BookOpenText, ChevronLeft, Image } from 'lucide-react';
import { AnnotationSearch } from '@components/AnnotationSearch';
import type { Annotation } from '@annotorious/react';

import './PageHeader.css';

interface PageHeaderProps {

  isRelatedImagesOpen: boolean;

  isRelatedVersesOpen: boolean;

  onClearSearch(): void;

  onHighlightSearchResult(a: Annotation): void;

  onSearch(hits: Annotation[]): void;

  onToggleRelatedImages(): void;

  onToggleRelatedVerses(): void;

}

export const PageHeader = (props: PageHeaderProps) => {

  const [searchHits, setSearchHits] = useState<Annotation[]>([]);

  useEffect(() => {
    props.onSearch(searchHits);
  }, [searchHits]);

  return (
    <header>
      <div className="header-left">
        <a href="../..">
          <ChevronLeft />
          <span>Home</span>
        </a>

        <a href="../../about">About</a>
      </div>

      <div className="header-right">
        <AnnotationSearch
          onClear={props.onClearSearch} 
          onHighlightResult={props.onHighlightSearchResult}
          onSearch={setSearchHits}  />

        <button 
          className={props.isRelatedVersesOpen ? 'toggle active' : 'toggle'}
          onClick={props.onToggleRelatedVerses}>
          <BookOpenText size={18} />
        </button>

        <button 
          className={props.isRelatedImagesOpen ? 'toggle active' : 'toggle'}
          onClick={props.onToggleRelatedImages}>
          <Image size={18} />
        </button>
      </div>
    </header>
  )

}