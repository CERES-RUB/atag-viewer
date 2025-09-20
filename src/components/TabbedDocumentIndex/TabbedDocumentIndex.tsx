import { useMemo } from 'react';
import * as Tabs from '@radix-ui/react-tabs';  
import type { ImageMetadata, VerseMetadata } from 'src/Types';

import './TabbedDocumentIndex.css';
import { SquareArrowOutUpRight } from 'lucide-react';

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
         Texts ({verses.length})
        </Tabs.Trigger>

        <Tabs.Trigger value="images">
          Images ({images.length})
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content className="tabs-content" value="verses">
        <ul>
          <li>
            <h3>1. Buddhacarita (Life of the Buddha)</h3>
            <ul>
              <li className="disabled">Aśvaghoṣa: Buddhacarita. Sarga 1.</li>
              <li className="disabled">Aśvaghoṣa: Buddhacarita. Sarga 2.</li>
              <li className="disabled">Aśvaghoṣa: Buddhacarita. Sarga 3.</li>
              <li className="disabled">Aśvaghoṣa: Buddhacarita. Sarga 4.</li>
              {verses.map(meta => (
                <li key={meta.slug}>
                  <a href={`verse/${meta.slug}`}>{meta.title}</a>
                  {meta.annotations === 0 && (
                    <span className="work-in-progress">WORK IN PROGRESS</span>
                  )}
                </li>
              ))}
              <li className="disabled">Aśvaghoṣa: Buddhacarita. Sarga 6.</li>
              <li className="disabled">Aśvaghoṣa: Buddhacarita. Sarga 7.</li>
              <li className="disabled">Aśvaghoṣa: Buddhacarita. Sarga 8.</li>
              <li className="disabled">Aśvaghoṣa: Buddhacarita. Sarga 9.</li>
              <li className="disabled">Aśvaghoṣa: Buddhacarita. Sarga 10.</li>
              <li className="disabled">Aśvaghoṣa: Buddhacarita. Sarga 11.</li>
              <li className="disabled">Aśvaghoṣa: Buddhacarita. Sarga 12.</li>
              <li className="disabled">Aśvaghoṣa: Buddhacarita. Sarga 13.</li>
              <li className="disabled">Aśvaghoṣa: Buddhacarita. Sarga 14.</li>
              <li className="disabled">Aśvaghoṣa: Buddhacarita. Sarga 15.</li>
            </ul>
          </li>

          <li>
            <h3>2. Saundarananda (Handsome Nanda)</h3>
          </li>

          <li>
            <h3>3. Śāriputraprakaraṇa (The Drama of Śāriputra)</h3>
          </li>
        </ul>
      </Tabs.Content>

      <Tabs.Content className="tabs-content" value="images">
        <ul>
          {images.map(meta => (
						<li key={meta.slug}>
              <p>
                <div>
                  <a href={`image/${meta.slug}`}>{meta.title}</a>
                  {meta.annotations === 0 && (
                    <span className="work-in-progress">WORK IN PROGRESS</span>
                  )}
                </div>

                <div className="credits">
                  <span>{meta.credits}</span>

                  <a href={meta.source} target="_blank">
                    <SquareArrowOutUpRight size={16} />
                  </a>
                </div>

                <div className="license">
                  {meta.license}
                </div>
              </p>
						</li>
					))}
        </ul>
      </Tabs.Content>
    </Tabs.Root>
  )

}