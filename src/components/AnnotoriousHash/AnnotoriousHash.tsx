import { useEffect, useState } from 'react';
import { useSelected } from '@lib/hooks';
import { useAnnotator } from '@annotorious/react';
import type { Annotation, Annotator, RecogitoTextAnnotator, TextAnnotation, W3CAnnotation, W3CTextAnnotation } from '@recogito/react-text-annotator';

// App-specific - annotation IDs are actually Recogito URIs, but 
// we're shortening to just the UUID that follows this prefix
const RECOGITO_PREFIX = 'https://recogito.pelagios.org/annotation/';

interface AnnotoriousHashProps {

  loaded: boolean;

}

export const AnnotoriousHash = (props: AnnotoriousHashProps) => {
  
  const anno = useAnnotator<RecogitoTextAnnotator>();

  const selected = useSelected();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) return;

    if (selected) {
      const id = selected.id.substring(selected.id.lastIndexOf('/') + 1);
      location.hash = `#${id}`;
    } else {
      location.hash = '';
    }
  }, [selected, mounted]);

  useEffect(() => {
    if (!anno || !props.loaded) return;

    // Select the annotation with the given UUID and bring it into view
    const select = (uuid: string) => {
      const uri = `https://recogito.pelagios.org/annotation/${uuid}`;

      const current = (anno.getSelected() as Annotation[] || []).map(a => a.id);
      if (current.includes(uri)) return;

      anno.setSelected(uri);

      // When in text mode, scroll to the selected annotation
      if ('scrollIntoView' in anno) {
        // TODO remove with next release of @recogito/text-annotator
        const a = anno.getAnnotationById(`https://recogito.pelagios.org/annotation/${uuid}`);
        anno.scrollIntoView(a as TextAnnotation);
      }
    }

    const deselect = () => {
      if (anno.getSelected()?.length > 0)
        anno.cancelSelected();
    }

    const hash = window.location.hash.substring(1);
    if (hash) {
      setTimeout(() => { 
        select(hash);
        setMounted(true);
      });
    } else {
      setMounted(true);
    }

    const onHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash)
        select(hash);
      else 
        deselect();
    }

    window.addEventListener('hashchange', onHashChange);

    return () => {
      window.removeEventListener('hashchange', onHashChange);
    }
  }, [anno, props.loaded]);

  return null;

}