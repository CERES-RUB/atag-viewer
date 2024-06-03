import { useEffect, useState } from 'react';
import type { Annotation } from '@annotorious/react';
import { PageHeader } from '@components/PageHeader';
import { RelatedImages } from '@components/RelatedImages';
import { RelatedVerses } from '@components/RelatedVerses';
import type { VerseMetadata } from 'src/Types';

import './VerseView.css';

interface VerseViewProps {

  verse: VerseMetadata;

}

export const VerseView = (props: VerseViewProps) => {

  const [verse, setVerse] = useState<string>();

  const [isRelatedImagesOpen, setRelatedImagesOpen] = useState(false);
  
  const [isRelatedVersesOpen, setRelatedVersesOpen] = useState(false);

  const [search, setSearch] = useState<Annotation[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(`../../verses/${props.verse.slug}.txt`).then(res => res.text()),
      fetch(`../../annotations/${props.verse.slug}.json`).then(res => res.json())
    ]).then(([verse, annotations]) => {
      setVerse(verse);

      // TODO annotations
    });
  }, []);

  return (
    <>
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
            {verse && <div>{verse}</div>}
          </div>
        </main>

        <RelatedVerses 
          open={isRelatedVersesOpen} />

        <RelatedImages
          open={isRelatedImagesOpen} />
      </div>
    </>
  )

}