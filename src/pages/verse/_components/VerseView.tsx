import { useCallback, useEffect, useState } from 'react';
import { Annotorious, type Annotation } from '@annotorious/react';
import type { W3CTextAnnotation, TextAnnotation } from '@recogito/react-text-annotator';
import { AnnotoriousHash } from '@components/AnnotoriousHash';
import { PageHeader } from '@components/PageHeader';
import { RelatedImages } from '@components/RelatedImages';
import { RelatedVerses } from '@components/RelatedVerses';
import { useAnnotations, useLocalStoreState } from '@lib/hooks';
import { AnnotatedVerse } from './AnnotatedVerse';
import type { Selected, VerseMetadata } from 'src/Types';

import './VerseView.css';

interface VerseViewProps {

  verse: VerseMetadata;

}

export const VerseView = (props: VerseViewProps) => {

  const [verse, setVerse] = useState<string>();

  const annotations = useAnnotations<W3CTextAnnotation>(`annotations/verse/${props.verse.slug}.json`);

  const [selected, setSelected] = useState<Selected | undefined>();

  const [isRelatedImagesPanelOpen, setRelatedImagesPanelOpen] = useLocalStoreState('diga.images.open', false);
  
  const [isRelatedVersesPanelOpen, setRelatedVersesPanelOpen] = useLocalStoreState('diga.verses.open', false);

  const [search, setSearch] = useState<Annotation[]>([]);

  const [highlightedSearchResult, setHighlightedSearchResult] = useState<TextAnnotation | undefined>();

  const searchResultSorter = useCallback((a: TextAnnotation, b: TextAnnotation) => {
    const startA = a.target.selector[0].start;
    const startB = b.target.selector[0].start;
    return startA - startB;
  }, []);

  useEffect(() => {
    fetch(`../../verses/${props.verse.slug}.txt`)
      .then(res => res.text())
      .then(setVerse);
  }, []);

  return (
    <Annotorious>
      <AnnotoriousHash 
        loaded={Boolean(annotations)} />

      <PageHeader 
        backToTab="verses"
        isRelatedImagesOpen={isRelatedImagesPanelOpen}
        isRelatedVersesOpen={isRelatedVersesPanelOpen}
        searchSorter={searchResultSorter}
        onToggleRelatedImages={() => setRelatedImagesPanelOpen(open => !open)}
        onToggleRelatedVerses={() => setRelatedVersesPanelOpen(open => !open)}
        onClearSearch={() => setSearch([])}
        onHighlightSearchResult={a => setHighlightedSearchResult(a as TextAnnotation)}
        onSearch={setSearch} />

      <div className="flex-wrapper">
        <main>
          <div className="page">
            <h1>{props.verse.title}</h1>
            {(verse && annotations) && (
              <AnnotatedVerse
                annotations={annotations}
                verse={verse} 
                searchResults={search} 
                highlightedSearchResult={highlightedSearchResult}
                onSelect={setSelected} 
                onOpenRelatedImages={() => setRelatedImagesPanelOpen(true)} 
                onOpenRelatedVerses={() => setRelatedVersesPanelOpen(true)} />
            )}
          </div>
        </main>

        <RelatedVerses 
          annotation={selected?.annotation}
          currentSlug={props.verse.slug}
          open={isRelatedVersesPanelOpen} 
          related={selected?.relatedVerses} 
          onClose={() => setRelatedVersesPanelOpen(false)} />

        <RelatedImages
          annotation={selected?.annotation}
          currentSlug={props.verse.slug}
          open={isRelatedImagesPanelOpen} 
          related={selected?.relatedImages} 
          onClose={() => setRelatedImagesPanelOpen(false)} />
      </div>
    </Annotorious>
  )

}