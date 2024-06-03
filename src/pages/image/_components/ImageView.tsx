import { useEffect, useState } from 'react';
import { Annotorious } from '@annotorious/react';
import type { W3CImageAnnotation, Annotation } from '@annotorious/react';
import { PageHeader } from '@components/PageHeader';
import { RelatedImages } from '@components/RelatedImages';
import { RelatedVerses } from '@components/RelatedVerses';
import { AnnotatedImage } from './AnnotatedImage';
import type { ImageMetadata } from 'src/Types';

import './ImageView.css';

interface ImageViewProps {

  image: ImageMetadata;

}

export const ImageView = (props: ImageViewProps) => {

  const [isRelatedImagesOpen, setRelatedImagesOpen] = useState(false);
  
  const [isRelatedVersesOpen, setRelatedVersesOpen] = useState(false);

  const [annotations, setAnnotations] = useState<W3CImageAnnotation[]>([]);

  const [search, setSearch] = useState<Annotation[]>([]);

  useEffect(() => {
    fetch(`../../annotations/image/${props.image.slug}.json`)
    .then((response) => response.json())
    .then(setAnnotations);
  }, []);

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