import { useEffect, useState } from 'react';
import { Annotorious, type Annotation } from '@annotorious/react';
import { PageHeader } from '@components/PageHeader';
import { RelatedImages } from '@components/RelatedImages';
import { RelatedVerses } from '@components/RelatedVerses';
import { useAnnotations } from '@lib/hooks';
import { useNarrativeTerms } from '../_hooks';
import { AnnotatedVerse } from './AnnotatedVerse';
import type { VerseMetadata } from 'src/Types';

import './VerseView.css';

interface VerseViewProps {

  verse: VerseMetadata;

}

export const VerseView = (props: VerseViewProps) => {

  const narrativeTerms = useNarrativeTerms();

  const [verse, setVerse] = useState<string>();

  const annotations = useAnnotations(`annotations/verse/${props.verse.slug}.json`);

  const [isRelatedImagesOpen, setRelatedImagesOpen] = useState(false);
  
  const [isRelatedVersesOpen, setRelatedVersesOpen] = useState(false);

  const [search, setSearch] = useState<Annotation[]>([]);

  useEffect(() => {
    fetch(`../../verses/${props.verse.slug}.txt`)
      .then(res => res.text())
      .then(setVerse);
  }, []);

  return (
    <Annotorious>
      <PageHeader 
        isRelatedImagesOpen={isRelatedImagesOpen}
        isRelatedVersesOpen={isRelatedVersesOpen}
        onToggleRelatedImages={() => setRelatedImagesOpen(open => !open)}
        onToggleRelatedVerses={() => setRelatedVersesOpen(open => !open)}
        onSearch={setSearch} />

      <div className="flex-wrapper">
        <main>
          <div className="page">
            <h1>{props.verse.title}</h1>
            {(verse && annotations.length > 0 && narrativeTerms.length > 0) && (
              <AnnotatedVerse
                annotations={annotations}
                narrativeTerms={narrativeTerms}
                verse={verse} 
                searchResults={search} />
            )}
          </div>
        </main>

        <RelatedVerses 
          open={isRelatedVersesOpen} />

        <RelatedImages
          open={isRelatedImagesOpen} />
      </div>
    </Annotorious>
  )

}