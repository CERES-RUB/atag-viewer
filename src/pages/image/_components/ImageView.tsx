import { useState } from 'react';
import { Annotorious } from '@annotorious/react';
import type { Annotation, W3CImageAnnotation } from '@annotorious/react';
import { PageHeader } from '@components/PageHeader';
import { RelatedImages } from '@components/RelatedImages';
import { RelatedVerses } from '@components/RelatedVerses';
import { useAnnotations } from '@lib/hooks';
import { AnnotatedImage } from './AnnotatedImage';
import type { ImageMetadata, Selected } from 'src/Types';

import './ImageView.css';

interface ImageViewProps {

  image: ImageMetadata;

}

export const ImageView = (props: ImageViewProps) => {

  const annotations = useAnnotations(`annotations/image/${props.image.slug}.json`);

  const [selected, setSelected] = useState<Selected | undefined>();

  const [isRelatedImagesPanelOpen, setRelatedImagesPanelOpen] = useState(false);
  
  const [isRelatedVersesPanelOpen, setRelatedVersesPanelOpen] = useState(false);

  const [search, setSearch] = useState<Annotation[]>([]);

  return (
    <Annotorious>
      <PageHeader 
        isRelatedImagesOpen={isRelatedImagesPanelOpen}
        isRelatedVersesOpen={isRelatedVersesPanelOpen}
        onToggleRelatedImages={() => setRelatedImagesPanelOpen(open => !open)}
        onToggleRelatedVerses={() => setRelatedVersesPanelOpen(open => !open)}
        onSearch={setSearch} />

      <div className="view-wrapper">
        <main>
          <AnnotatedImage 
            annotations={annotations as W3CImageAnnotation[]} 
            imageManifest={props.image.manifest}
            isRelatedImagesOpen={isRelatedImagesPanelOpen}
            isRelatedVersesOpen={isRelatedVersesPanelOpen}
            searchResults={search} 
            onSelect={setSelected} 
            onOpenRelatedImages={() => setRelatedImagesPanelOpen(true)} 
            onOpenRelatedVerses={() => setRelatedVersesPanelOpen(true)} />
        </main>

        <div className="drawer-wrapper">
          <RelatedVerses 
            open={isRelatedVersesPanelOpen} 
            related={selected?.relatedVerses} />

          <RelatedImages
            open={isRelatedImagesPanelOpen} 
            related={selected?.relatedImages} />
        </div>
      </div>
    </Annotorious>
  )

}