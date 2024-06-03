import { useState } from 'react';
import { Annotorious } from '@annotorious/react';
import type { Annotation } from '@annotorious/react';
import { PageHeader } from '@components/PageHeader';
import { RelatedImages } from '@components/RelatedImages';
import { RelatedVerses } from '@components/RelatedVerses';
import { useAnnotations } from '@lib/hooks';
import { AnnotatedImage } from './AnnotatedImage';
import type { ImageMetadata } from 'src/Types';

import './ImageView.css';

interface ImageViewProps {

  image: ImageMetadata;

}

export const ImageView = (props: ImageViewProps) => {

  const [isRelatedImagesOpen, setRelatedImagesOpen] = useState(false);
  
  const [isRelatedVersesOpen, setRelatedVersesOpen] = useState(false);

  const annotations = useAnnotations(`annotations/image/${props.image.slug}.json`);

  const [search, setSearch] = useState<Annotation[]>([]);

  return (
    <Annotorious>
      <PageHeader 
        isRelatedImagesOpen={isRelatedImagesOpen}
        isRelatedVersesOpen={isRelatedVersesOpen}
        onToggleRelatedImages={() => setRelatedImagesOpen(open => !open)}
        onToggleRelatedVerses={() => setRelatedVersesOpen(open => !open)}
        onSearch={setSearch} />

      <div className="view-wrapper">
        <main>
          <AnnotatedImage 
            annotations={annotations} 
            imageManifest={props.image.manifest}
            isRelatedImagesOpen={isRelatedImagesOpen}
            isRelatedVersesOpen={isRelatedVersesOpen}
            searchResults={search} />
        </main>

        <div className="drawer-wrapper">
          <RelatedVerses 
            open={isRelatedVersesOpen} />

          <RelatedImages
            open={isRelatedImagesOpen} />
        </div>
      </div>
    </Annotorious>
  )

}