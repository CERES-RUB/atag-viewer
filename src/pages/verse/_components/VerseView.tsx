import { useEffect, useState } from 'react';
import { Annotorious, type Annotation } from '@annotorious/react';
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

  const annotations = useAnnotations(`annotations/verse/${props.verse.slug}.json`);

  const [selected, setSelected] = useState<Selected | undefined>();

  const [isRelatedImagesPanelOpen, setRelatedImagesPanelOpen] = useLocalStoreState('diga.images.open', false);
  
  const [isRelatedVersesPanelOpen, setRelatedVersesPanelOpen] = useLocalStoreState('diga.verses.open', false);

  const [search, setSearch] = useState<Annotation[]>([]);

  useEffect(() => {
    fetch(`../../verses/${props.verse.slug}.txt`)
      .then(res => res.text())
      .then(setVerse);
  }, []);

  const onHighlightSearchResult = (a: Annotation) => {
    // TODO
  }

  const onClearSearch = () => {
    // TODO
  }

  return (
    <Annotorious>
      <AnnotoriousHash 
        loaded={Boolean(annotations)} />

      <PageHeader 
        isRelatedImagesOpen={isRelatedImagesPanelOpen}
        isRelatedVersesOpen={isRelatedVersesPanelOpen}
        onToggleRelatedImages={() => setRelatedImagesPanelOpen(open => !open)}
        onToggleRelatedVerses={() => setRelatedVersesPanelOpen(open => !open)}
        onClearSearch={onClearSearch}
        onHighlightSearchResult={onHighlightSearchResult}
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
                onSelect={setSelected} 
                onOpenRelatedImages={() => setRelatedImagesPanelOpen(true)} 
                onOpenRelatedVerses={() => setRelatedVersesPanelOpen(true)} />
            )}
          </div>
        </main>

        <RelatedVerses 
          annotation={selected?.annotation}
          open={isRelatedVersesPanelOpen} 
          related={selected?.relatedVerses} 
          onClose={() => setRelatedVersesPanelOpen(false)} />

        <RelatedImages
          annotation={selected?.annotation}
          open={isRelatedImagesPanelOpen} 
          related={selected?.relatedImages} 
          onClose={() => setRelatedImagesPanelOpen(false)} />
      </div>
    </Annotorious>
  )

}