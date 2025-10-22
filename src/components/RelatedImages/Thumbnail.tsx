import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import './Thumbnail.css';
import 'react-loading-skeleton/dist/skeleton.css';

interface ThumbnailProps {

  href: string;

  src: string;

}

export const Thumbnail = (props: ThumbnailProps) => {

  const [loaded, setLoaded] = useState(false);

  return (
    <a href={props.href} className="thumbnail-wrapper">
      {!loaded && (<Skeleton />)}
      <img 
        src={props.src.startsWith('/thumbnails') ? `../..${props.src}` : props.src} 
        style={{ display: loaded ? undefined : 'none' }} 
        onLoad={() => setLoaded(true)}/>
    </a>
  )

}