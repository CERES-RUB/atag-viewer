import fs from 'fs';

const listImages = () => {
  const json = fs.readFileSync('./public/images.json');
  return JSON.parse(json.toString())
}

const listVerses = () => {
  const json = fs.readFileSync('./public/verses.json');
  return JSON.parse(json.toString());
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
  return listImages().reduce((all, image) => {
    const str = fs.readFileSync(`./public/annotations/image/${image.slug}.json`);

    const w3c = JSON.parse(str.toString());

    const related = w3c.map(a => {
      const { id } = a;

      const bodies = Array.isArray(a.body) ? a.body : [a.body];

      const tags = bodies.filter(b => b.purpose === 'tagging').map(b => b.value).filter(Boolean);

      const { x, y, w, h } = parseFragmentSelector(a.target.selector[0].value);

      const path = `${x},${y},${x},${h}/full/0/default.jpg`;

      const thumbnail = image.manifest.replace('info.json', path);

      return {
        id, 
        image: image.title,
        slug: image.slug,
        thumbnail,
        tags
      };
    });

    return [...all, ...related];
  }, []);
}

const annotations = buildTagIndex();

fs.writeFileSync(`public/tag-index.json`, JSON.stringify(annotations, null, 2));

