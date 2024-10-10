import { useEffect, useRef, useState } from 'react';
import { SquareArrowOutUpRight } from 'lucide-react';
import { animated, useSpring } from '@react-spring/web';
import type { ImageMetadata } from 'src/Types';

import './MetadataOverlay.css';

interface MetadataOverlayProps {

  image: ImageMetadata;

}

export const MetadataOverlay = (props: MetadataOverlayProps) => {

  const { 
    credits, 
    dimensions,
    license, 
    provenance,
    source,
    title 
  } = props.image;

  const ref = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  const [height, setHeight] = useState(0);

  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    console.log(ref.current.scrollWidth, ref.current.scrollHeight);

    setHeight(ref.current.scrollHeight);
    setWidth(ref.current.scrollWidth);
  }, [props.image]);

  const springProps = useSpring({
    width: isOpen ? width : 40,  // Adjust the expanded width as needed
    height: isOpen ? height: 40,  // Add padding to content height
    // opacity: isOpen ? 1 : 0,
    config: { tension: 400, friction: 40 }
  });

  return (
    <animated.div 
      style={springProps}
      className="image-metadata-overlay"
      onClick={() => setIsOpen(open => !open)}>
      <div ref={ref}>
        <h2>{title}</h2>
        <p>
          <div className="dimensions">
            {dimensions}
          </div>

          <div className="credits">
            <span>{credits}</span>

            <a href={source} target="_blank">
              <SquareArrowOutUpRight size={16} />
            </a>
          </div>

          <div className="license">
            {license}
          </div>

          <div className="provenance">
            {provenance}
          </div>
        </p>
      </div>
    </animated.div>
  )

}