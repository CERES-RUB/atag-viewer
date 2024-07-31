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

  // Pipe characters don't normally wrap. We insert a 'line-breakable' pipe, by replacing the
  // pipe with a combination of pipe and zero-width space
  const makeBreakable = (str: string) => str.replace(/\|/g, '|&#8203;');

  return (
    <>
      {paddedPrefix && (<span dangerouslySetInnerHTML={{__html: makeBreakable(paddedPrefix) }} />)}
      <a href={props.href} className="verse-snippet-quote" dangerouslySetInnerHTML={{__html: makeBreakable(quote)}} />
      {paddedSuffix && (<span dangerouslySetInnerHTML={{ __html: makeBreakable(paddedSuffix) }} />)}
    </>
  )

}