import { useEffect, useState } from 'react';
import { Annotorious, type Annotation } from '@annotorious/react';
import { PageHeader } from '@components/PageHeader';
import { RelatedImages } from '@components/RelatedImages';
import { RelatedVerses } from '@components/RelatedVerses';
import { useAnnotations } from '@lib/hooks';
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

  const [isRelatedImagesPanelOpen, setRelatedImagesPanelOpen] = useState(false);
  
  const [isRelatedVersesPanelOpen, setRelatedVersesPanelOpen] = useState(false);

  const [search, setSearch] = useState<Annotation[]>([]);

  useEffect(() => {
    fetch(`../../verses/${props.verse.slug}.txt`)
      .then(res => res.text())
      .then(setVerse);
  }, []);

  return (
    <Annotorious>
      <PageHeader 
        isRelatedImagesOpen={isRelatedImagesPanelOpen}
        isRelatedVersesOpen={isRelatedVersesPanelOpen}
        onToggleRelatedImages={() => setRelatedImagesPanelOpen(open => !open)}
        onToggleRelatedVerses={() => setRelatedVersesPanelOpen(open => !open)}
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
          open={isRelatedVersesPanelOpen} 
          related={selected?.relatedVerses} />

        <RelatedImages
          open={isRelatedImagesPanelOpen} 
          related={selected?.relatedImages} />
      </div>
    </Annotorious>
  )

}