import * as Tabs from '@radix-ui/react-tabs';  
import type { ImageMetadata, VerseMetadata } from 'src/Types';

import './TabbedDocumentIndex.css';

interface TabbedDocumentIndexProps {

  verses: VerseMetadata[];

  images: ImageMetadata[];

}

export const TabbedDocumentIndex = (props: TabbedDocumentIndexProps) => {

  const { images, verses } = props;

  return (
    <Tabs.Root className="tabbed-document-index" defaultValue="verses">
      <Tabs.List className="tabs-list">
        <Tabs.Trigger value="verses">
          {verses.length}  Verses
        </Tabs.Trigger>

        <Tabs.Trigger value="images">
          {images.length} Images
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content className="tabs-content" value="verses">
        <ul>
					{verses.map(meta => (
						<li>
							<a href={`verse/${meta.slug}`}>{meta.title}</a>
						</li>
					))}
				</ul>
      </Tabs.Content>

      <Tabs.Content className="tabs-content" value="images">
        <ul>
          {images.map(meta => (
						<li>
							<a href={`image/${meta.slug}`}>{meta.title}</a>
						</li>
					))}
        </ul>
      </Tabs.Content>
    </Tabs.Root>
  )

}