import { useEffect, useRef, useState } from 'react';
import { Info, Minimize2, SquareArrowOutUpRight } from 'lucide-react';
import { animated, useSpring, to } from '@react-spring/web';
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

    setHeight(ref.current.scrollHeight);
    setWidth(ref.current.scrollWidth);
  }, [props.image]);

  const springProps = useSpring({
    width: isOpen ? width : 0,  // Adjust the expanded width as needed
    height: isOpen ? height: 0,  // Add padding to content height
    opacity: isOpen ? 1 : 0,
    config: { tension: 400, friction: 40 }
  });

  const { opacity, ...size } = springProps;

  return (
    <animated.div 
      style={size}
      className="image-metadata-overlay">
      <div ref={ref}>
        <animated.div
          className="trigger"
          style={{ opacity: to(opacity, o => 1 - o)  }}>
          <button onClick={() => setIsOpen(true)}>
            <Info size={32} />
          </button>
        </animated.div>

        <animated.div 
          className="content" 
          style={{ opacity }}>
          <button className="close" onClick={() => setIsOpen(false)}>
            <Minimize2 size={18} />
          </button>

          <h2>{title}</h2>

          <div className="dimensions-and-provenance">
            {dimensions} · {provenance}
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
        </animated.div>
      </div>
    </animated.div>
  )

}