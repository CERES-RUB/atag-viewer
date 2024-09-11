import fs from 'fs';
import fetch from 'node-fetch';

const listImages = () => {
  const json = fs.readFileSync('./public/images.json');
  return JSON.parse(json.toString())
}

const fetchManifests = (urls) => {
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  return urls.reduce(async (promise, url) => promise.then(async results => {
    try {
      if (url) {
        console.log('Fetching manifest ', url);
        const response = await fetch(url);
        const manifest = await response.json();
        results.push({ url, manifest });
      }
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
    }

    await delay(500); 
    
    return results;
  }), Promise.resolve([]));
}

const listVerses = () => {
  const json = fs.readFileSync('./public/verses.json');
  return JSON.parse(json.toString());
}

const extractSnippet = (txtFilePath, annotation) => {
  const text = fs.readFileSync(txtFilePath, 'utf-8');

  const selector = annotation.target.selector.find(s => s.type === 'TextPositionSelector');

  if (selector) {
    const { start, end } = selector;

    const quote = text.substring(start, end).replaceAll(/\s+/g, ' ');

    // Collapse any number of space and newline chars to a single space
    const normalize = (str) => str.replace(/[\s\n]+/g, ' ');

    const findWords = (str, index, direction, count) => {
      const splitRegex = /[\s|]+|[^\s|]+/g;
      
      if (direction === 'BACK') {
        // words = str.slice(0, index).split(splitRegex).filter(Boolean);
        const words = str.slice(0, index).match(splitRegex) || [];
        const prefix = words.slice(-(2 * count));
        return normalize(prefix.join(''));
      } else {
        const words = str.slice(index).match(splitRegex) || [];
        const suffix = words.slice(0, 2 * count);
        return normalize(suffix.join(''));
      }
    };

    const prefix = findWords(text, start, 'BACK', 3);
    const suffix = findWords(text, end, 'FORWARD', 3);

    return { prefix, quote, suffix };
  }
}

const parseFragmentSelector = (fragment) => {
  const regex = /^(xywh)=(pixel|percent)?:?(.+?),(.+?),(.+?),(.+)*/g;

  const matches = [...fragment.matchAll(regex)][0];
  const [_, prefix, unit, a, b, c, d] = matches;

  if (prefix !== 'xywh') throw new Error('Unsupported MediaFragment: ' + fragment);

  if (unit && unit !== 'pixel') throw new Error(`Unsupported MediaFragment unit: ${unit}`);

  const [x, y, w, h] = [a, b, c, d].map(parseFloat);

  return {
    x,
    y,
    w,
    h,
    bounds: {
      minX: x,
      minY: y,
      maxX: x + w,
      maxY: y + h
    }
  }
}

const buildTagIndex = async () => {
  const images = listImages();

  const manifests = await fetchManifests(images.map(i => i.manifest));

  console.log('Building tag index...');
  
  const relatedImages = images.reduce((all, image) => {
    const str = fs.readFileSync(`./public/annotations/image/${image.slug}.json`);
    const w3c = JSON.parse(str.toString());

    const related = w3c.reduce((all, annotation) => {
      const { id } = annotation;

      const bodies = Array.isArray(annotation.body) ? annotation.body : [annotation.body];
      const tags = bodies
        .filter(b => b.purpose === 'tagging' && b.id && b.value)
        .map(b => ({ id: b.id, label: b.value }));

      const { x, y, w, h } = parseFragmentSelector(annotation.target.selector[0].value);

      if (image.format === 'IMAGE') {
        return [...all, {
          type: 'IMAGE',
          // No annotation ID if this is image-level metadata
          id: (w > 0 && h > 0) ? id : undefined, 
          image: image.title,
          slug: image.slug,
          // thumbnail: `/images/${image.slug}.jpg`,
          thumbnail: `${id.replace('/annotation', '/api/annotation')}.jpg`,
          tags
        }];
      } else {
        let isPortrait;

        if (w > 0 && h > 0)
          isPortrait = w > h;

        if (w === 0 && h === 0) {
          const { width, height } = manifests.find(m => m.url === image.manifest);
          isPortrait = width > height;
        }

        const path = 
          // Image snippet
          (w > 0 && h > 0) ? isPortrait ? `${x},${y},${w},${h}/,160/0/default.jpg` : `${x},${y},${w},${h}/160,/0/default.jpg` :
          // Image as a whole
          (w === 0 && h === 0) ? isPortrait ? `full/,160/0/default.jpg` : `full/160,/0/default.jpg` :
          // Should never happen
          undefined; 

        if (path) {
          const thumbnail = image.manifest.replace('info.json', path);

          return [...all, {
            type: 'IMAGE',
            // No annotation ID if this is image-level metadata
            id: (w > 0 && h > 0) ? id : undefined, 
            image: image.title,
            slug: image.slug,
            thumbnail,
            tags
          }];
        } else {
          return all;
        }
      }
    }, []);

    return [...all, ...related];
  }, []);

  const relatedVerses = listVerses().reduce((all, verse) => {
    const str = fs.readFileSync(`./public/annotations/verse/${verse.slug}.json`);
    const w3c = JSON.parse(str.toString()).slice().sort((a, b) => {
      const startA = a.target.selector[0].start;
      const startB = b.target.selector[0].end;
      return startA - startB;
    });

    const related = w3c.map(a => {
      const { id } = a;

      const bodies = Array.isArray(a.body) ? a.body : [a.body];
      const tags = bodies
        .filter(b => b.purpose === 'tagging' && b.id && b.value)
        .map(b => ({ id: b.id, label: b.value }));

      const snippet = extractSnippet(`./public/verses/${verse.slug}.txt`, a);

      return {
        type: 'VERSE',
        id, 
        verse: verse.title,
        slug: verse.slug,
        snippet,
        tags
      };
    });

    return [...all, ...related];
  }, []);

  return [...relatedImages, ...relatedVerses];
}

const annotations = await buildTagIndex();
fs.writeFileSync(`public/tag-index.json`, JSON.stringify(annotations, null, 2));

console.log(`Done (${annotations.length} anntoations).`);
