import type { VerseSnippet } from 'src/Types';

import './Snippet.css';
import { useMemo } from 'react';

interface SnippetProps {

  value: VerseSnippet; 

  href: string;

}

export const Snippet = (props: SnippetProps) => {

  const { prefix, quote, suffix } = props.value;

  const [paddedPrefix, paddedSuffix] = useMemo(() => {
    const paddedPrefix = prefix && (prefix.endsWith('|') ? prefix : prefix + ' ');
    const paddedSuffix = suffix && (suffix?.startsWith('|') ? suffix : ' ' + suffix);
    return [paddedPrefix, paddedSuffix];
  }, [prefix, quote, suffix]);

  return (
    <>
      <span>{paddedPrefix}</span>
      <a href={props.href} className="verse-snippet-quote">{quote}</a>
      <span>{paddedSuffix}</span>
    </>
  )

}