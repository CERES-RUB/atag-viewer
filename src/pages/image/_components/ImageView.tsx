import { useState } from 'react';
import { Annotorious, type Annotation } from '@annotorious/react';
import { PageHeader } from '@components/PageHeader';
import { RelatedImages } from '@components/RelatedImages';
import { RelatedVerses } from '@components/RelatedVerses';
import type { ImageMetadata } from 'src/Types';

import './ImageView.css';
import { AnnotatedImage } from './AnnotatedImage';

interface ImageViewProps {

  image: ImageMetadata;

}

export const ImageView = (props: ImageViewProps) => {

  const [isRelatedImagesOpen, setRelatedImagesOpen] = useState(false);
  
  const [isRelatedVersesOpen, setRelatedVersesOpen] = useState(false);

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
            annotations={[]} 
            imageManifest={props.image.manifest}
            searchResults={[]} />
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