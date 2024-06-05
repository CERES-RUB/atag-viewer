import { useEffect, useState } from 'react';
import { useSelected } from '@lib/hooks';
import { useAnnotator } from '@annotorious/react';

// App-specific - annotation IDs are actually Recogito URIs, but 
// we're shortening to just the UUID that follows this prefix
const RECOGITO_PREFIX = 'https://recogito.pelagios.org/annotation/';

interface AnnotoriousHashProps {

  loaded: boolean;

}

export const AnnotoriousHash = (props: AnnotoriousHashProps) => {
  
  const anno = useAnnotator();

  const selected = useSelected();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) return;

    const setHash = (hash?: string) => {
      if (history.pushState)
        history.pushState(undefined, document.title, hash ? `#${hash}` : window.location.pathname);
      else
        location.hash = hash ? `#${hash}` : '';
    }

    if (selected) {
      const id = selected.id.substring(selected.id.lastIndexOf('/') + 1);
      setHash(id);
    } else {
      setHash(undefined);
    }
  }, [selected, mounted]);

  useEffect(() => {
    if (!anno || !props.loaded) return;

    const hash = window.location.hash.substring(1);
    if (hash) {
      setTimeout(() => { 
        anno.setSelected(`https://recogito.pelagios.org/annotation/${hash}`);
        setMounted(true);

        // TODO clean up
        const a = anno.getAnnotationById(`https://recogito.pelagios.org/annotation/${hash}`);
        // @ts-ignore
        anno.scrollIntoView(a);
        // /TODO
      });
    } else {
      setMounted(true);
    }

    const onHashChange = () => {
      const hash = window.location.hash.substring(1);
      
      anno.setSelected(`https://recogito.pelagios.org/annotation/${hash}`);

      // TODO clean up
      const a = anno.getAnnotationById(`https://recogito.pelagios.org/annotation/${hash}`);
      // @ts-ignore
      anno.scrollIntoView(a);
      // /TODO
    }

    window.addEventListener('hashchange', onHashChange);

    return () => {
      window.removeEventListener('hashchange', onHashChange);
    }
  }, [anno, props.loaded]);

  return null;

}