import * as Tabs from '@radix-ui/react-tabs';  
import type { ImageMetadata, VerseMetadata } from 'src/Types';

interface TabbedDocumentIndexProps {

  verses: VerseMetadata[];

  images: ImageMetadata[];

}

export const TabbedDocumentIndex = (props: TabbedDocumentIndexProps) => {

  const { images, verses } = props;

  return (
    <Tabs.Root defaultValue="verses">
      <Tabs.List>
        <Tabs.Trigger value="verses">
          Verses
        </Tabs.Trigger>

        <Tabs.Trigger value="images">
          Images
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="verses">
        <h2>Verses</h2>

        <ul>
					{verses.map(meta => (
						<li>
							<a href={`verse/${meta.slug}`}>{meta.title}</a>
						</li>
					))}
				</ul>
      </Tabs.Content>

      <Tabs.Content value="images">
        <h2>Images</h2>
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