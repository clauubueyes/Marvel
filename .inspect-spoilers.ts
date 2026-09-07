import { characters } from './repositories/characterRepository';
import { mcuCatalog } from './data/mcuCatalog';
for (const c of characters.slice(16,35)) console.log(JSON.stringify({id:c.id, story:c.story, overview:c.description, quote:c.quote, facts:c.facts, video:c.screenMoment, variants:c.variants, appearances:c.appearances.map(a=>a.titleId)}));
