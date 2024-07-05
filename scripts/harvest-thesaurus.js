import fetch from 'node-fetch';
import fs from 'fs';

const getTopConcepts = async () => {
  const response = await fetch('https://diga.skosmos.ub.rub.de/rest/v1/thesaurus/topConcepts');
  const { topconcepts } = await response.json();
  return topconcepts.map(obj => obj.uri);
}

const fetchChildren = async (uri) => {
  console.log('Harvesting children:', uri);
  const query = `https://diga.skosmos.ub.rub.de/rest/v1/thesaurus/search?parent=${uri}`
  const response = await fetch(query);
  const data = await response.json();
  return data.results;
};

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const removeDuplicates = (data) => {
  const seen = new Set();

  return data.filter(item => {
    const duplicate = seen.has(item.uri);
    seen.add(item.uri);
    return !duplicate;
  });
};

const harvest = async () => {
  const toHarvest = await getTopConcepts();

  console.log(`Got ${toHarvest.length} top level concepts`);

  const delay = 250; //ms

  const all = [];

  for (const url of toHarvest) {
    const concepts = await fetchChildren(url);
    all.push(...concepts);
    await wait(delay);
  }

  console.log(`Got ${all.length} concepts - deduplicating`);
  
  const unique = removeDuplicates(all);

  console.log(`Got ${unique.length} concepts - saving to file`);
  fs.writeFileSync('./public/thesaurus/all-concepts.json', JSON.stringify(unique, null, 2), { encoding: 'utf8' });

  const compact = unique.map(item => item.prefLabel);
  fs.writeFileSync('./public/thesaurus/all-concepts-compact.json', JSON.stringify(compact, null, 2), { encoding: 'utf8' });

  console.log('Done.')
};

harvest();