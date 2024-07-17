import { useState } from 'react';
import { Annotorious } from '@annotorious/react';
import type { Annotation, W3CImageAnnotation } from '@annotorious/react';
import { AnnotoriousHash } from '@components/AnnotoriousHash';
import { PageHeader } from '@components/PageHeader';
import { RelatedImages } from '@components/RelatedImages';
import { RelatedVerses } from '@components/RelatedVerses';
import { useAnnotations, useLocalStoreState } from '@lib/hooks';
import { AnnotatedImage } from './AnnotatedImage';
import type { ImageMetadata, Selected } from 'src/Types';

import './ImageView.css';

interface ImageViewProps {

  image: ImageMetadata;

}

export const ImageView = (props: ImageViewProps) => {

  const annotations = useAnnotations(`annotations/image/${props.image.slug}.json`);

  const [selected, setSelected] = useState<Selected | undefined>();

  const [isRelatedImagesPanelOpen, setRelatedImagesPanelOpen] = useLocalStoreState('diga.images.open', false);
  
  const [isRelatedVersesPanelOpen, setRelatedVersesPanelOpen] = useLocalStoreState('diga.verses.open', false);

  const [search, setSearch] = useState<Annotation[]>([]);

  const [highlightedSearchResult, setHighlightedSearchResult] = useState<Annotation | undefined>();

  return (
    <Annotorious>
      <AnnotoriousHash 
        loaded={Boolean(annotations)} />

      <PageHeader 
        backToTab="images"
        isRelatedImagesOpen={isRelatedImagesPanelOpen}
        isRelatedVersesOpen={isRelatedVersesPanelOpen}
        onToggleRelatedImages={() => setRelatedImagesPanelOpen(open => !open)}
        onToggleRelatedVerses={() => setRelatedVersesPanelOpen(open => !open)}
        onClearSearch={() => setSearch([])}
        onHighlightSearchResult={setHighlightedSearchResult}
        onSearch={setSearch} />

      <div className="flex-wrapper">
        <main>
          <AnnotatedImage 
            annotations={annotations as W3CImageAnnotation[]} 
            highlightedSearchResult={highlightedSearchResult}
            imageManifest={props.image.manifest}
            searchResults={search} 
            onSelect={setSelected} 
            onOpenRelatedImages={() => setRelatedImagesPanelOpen(true)} 
            onOpenRelatedVerses={() => setRelatedVersesPanelOpen(true)} />
        </main>

        <RelatedVerses 
          annotation={selected?.annotation}
          currentSlug={props.image.slug}
          open={isRelatedVersesPanelOpen} 
          related={selected?.relatedVerses} 
          onClose={() => setRelatedVersesPanelOpen(false)} />

        <RelatedImages
          annotation={selected?.annotation}
          currentSlug={props.image.slug}
          open={isRelatedImagesPanelOpen} 
          related={selected?.relatedImages} 
          onClose={() => setRelatedImagesPanelOpen(false)} />
      </div>
    </Annotorious>
  )

}