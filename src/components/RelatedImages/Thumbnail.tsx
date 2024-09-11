import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import './Thumbnail.css';
import 'react-loading-skeleton/dist/skeleton.css';

interface ThumbnailProps {

  src: string;

}

export const Thumbnail = (props: ThumbnailProps) => {

  const [loaded, setLoaded] = useState(false);

  return (
    <div className="thumbnail-wrapper">
      {!loaded && (<Skeleton />)}
      <img 
        src={props.src} 
        style={{ display: loaded ? undefined : 'none' }} 
        onLoad={() => setLoaded(true)}/>
    </div>
  )

}