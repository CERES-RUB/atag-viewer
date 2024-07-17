import { useMemo } from 'react';
import * as Tabs from '@radix-ui/react-tabs';  
import type { ImageMetadata, VerseMetadata } from 'src/Types';

import './TabbedDocumentIndex.css';

interface TabbedDocumentIndexProps {

  tab?: 'images' | 'verses';

  verses: VerseMetadata[];

  images: ImageMetadata[];

}

export const TabbedDocumentIndex = (props: TabbedDocumentIndexProps) => {

  const { images, verses } = props;

  const tab = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab');
  }, []);

  const onChangeTab = (tab: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState(null, '', url.toString());
  }

  return (
    <Tabs.Root 
      className="tabbed-document-index" 
      defaultValue={tab || 'verses'}
      onValueChange={onChangeTab}>
      <Tabs.List className="tabs-list">
        <Tabs.Trigger value="verses">
          Sanskrit Verses ({verses.length})
        </Tabs.Trigger>

        <Tabs.Trigger value="images">
          Images ({images.length})
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content className="tabs-content" value="verses">
        <ul>
					{verses.map(meta => (
						<li key={meta.slug}>
							<a href={`verse/${meta.slug}`}>{meta.title}</a>
						</li>
					))}
				</ul>
      </Tabs.Content>

      <Tabs.Content className="tabs-content" value="images">
        <ul>
          {images.map(meta => (
						<li key={meta.slug}>
							<a href={`image/${meta.slug}`}>{meta.title}</a>
						</li>
					))}
        </ul>
      </Tabs.Content>
    </Tabs.Root>
  )

}