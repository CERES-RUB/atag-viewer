import fs from 'fs';

const listImages = () => {
  const json = fs.readFileSync('./public/images.json');
  return JSON.parse(json.toString())
}

const listVerses = () => {
  const json = fs.readFileSync('./public/verses.json');
  return JSON.parse(json.toString());
}

const findWhitespaceBefore = (text, index) => {
  while (index > 0 && !/\s/.test(text[index])) {
    index--;
  }
  return index;
}

const findWhitespaceAfter = (text, index) => {
  while (index < text.length && !/\s/.test(text[index])) {
    index++;
  }
  return index;
}

const extractSnippet = (txtFilePath, annotation, contextSize = 20) => {
  const text = fs.readFileSync(txtFilePath, 'utf-8');

  const selector = annotation.target.selector.find(s => s.type === 'TextPositionSelector');

  if (selector) {
    const { start, end } = selector;

    // Find the nearest whitespace before and after the desired context
    const prefixStart = findWhitespaceBefore(text, start - contextSize);
    const suffixEnd = findWhitespaceAfter(text, end + contextSize);

    const snippet = text.substring(start, end);
    const prefix = text.substring(prefixStart, start);
    const suffix = text.substring(end, suffixEnd);

    return `${prefix} ${snippet} ${suffix}`.replaceAll(/\s+/g, ' ').trim()
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

const buildTagIndex = () => {
  const relatedImages = listImages().reduce((all, image) => {
    const str = fs.readFileSync(`./public/annotations/image/${image.slug}.json`);
    const w3c = JSON.parse(str.toString());

    const related = w3c.reduce((all, annotation) => {
      const { id } = annotation;

      const bodies = Array.isArray(annotation.body) ? annotation.body : [annotation.body];
      const tags = bodies.filter(b => b.purpose === 'tagging').map(b => b.value).filter(Boolean);

      const { x, y, w, h } = parseFragmentSelector(annotation.target.selector[0].value);
      if (w > 0 && h > 0) {
        const path = `${x},${y},${w},${h}/full/0/default.jpg`;
        const thumbnail = image.manifest.replace('info.json', path);

        return [...all, {
          type: 'IMAGE',
          id, 
          image: image.title,
          slug: image.slug,
          thumbnail,
          tags
        }];
      } else {
        return all;
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
      const tags = bodies.filter(b => b.purpose === 'tagging').map(b => b.value).filter(Boolean);

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

console.log('Building tag index...');

const annotations = buildTagIndex();
fs.writeFileSync(`public/tag-index.json`, JSON.stringify(annotations, null, 2));

console.log(`Done (${annotations.length} anntoations).`);
