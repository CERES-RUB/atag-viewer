import { useEffect, useState } from 'react';
import { BookOpenText, ChevronLeft, Image } from 'lucide-react';
import { AnnotationSearch } from '@components/AnnotationSearch';
import { RelatedImages } from '@components/RelatedImages';
import { RelatedVerses } from '@components/RelatedVerses';
import type { VerseMetadata } from 'src/Types';

import './VerseView.css';

interface VerseViewProps {

  verse: VerseMetadata;

}

export const VerseView = (props: VerseViewProps) => {

  const [verse, setVerse] = useState<string>();

  const [search, setSearch] = useState<string[]>([]);

  const [relatedVersesOpen, setRelatedVersesOpen] = useState(false);

  const [relatedImagesOpen, setRelatedImagesOpen] = useState(false);

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
            onSearch={hits => setSearch(hits.map(a => a.id))}/>

          <button 
            className={relatedVersesOpen ? 'toggle active' : 'toggle'}
            onClick={() => setRelatedVersesOpen(open => !open)}>
            <BookOpenText size={18} />
          </button>

          <button 
            className={relatedImagesOpen ? 'toggle active' : 'toggle'}
            onClick={() => setRelatedImagesOpen(open => !open)}>
            <Image size={18} />
          </button>
        </div>
      </header>

      <div className="flex-wrapper">
        <main>
          <div className="page">
            <h1>{props.verse.title}</h1>
            {verse && <div>{verse}</div>}
          </div>
        </main>

        <RelatedVerses 
          open={relatedVersesOpen} />

        <RelatedImages
          open={relatedImagesOpen} />
      </div>
    </>
  )

}