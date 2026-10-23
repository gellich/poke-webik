const cache=new Map();
async function request(path,signal){if(cache.has(path))return cache.get(path);const r=await fetch('https://pokeapi.co/api/v2/'+path,{signal});if(!r.ok)throw Error(r.status===404?'NOT_FOUND':'HTTP_'+r.status);const data=await r.json();cache.set(path,data);return data}
export function getPokemon(q,signal){q=String(q).trim().toLowerCase();if(!/^[a-z0-9-]+$/.test(q))throw Error('NOT_FOUND');return request('pokemon/'+encodeURIComponent(q)+'/',signal)}
export function getSpecies(id,signal){return request('pokemon-species/'+id+'/',signal)}
export function getEvolution(url,signal){const m=url.match(/evolution-chain\/(\d+)\/?$/);if(!m)throw Error('INVALID_CHAIN');return request('evolution-chain/'+m[1]+'/',signal)}
export function chainNames(node){return [node.species.name,...node.evolves_to.flatMap(chainNames)]}
export function sprite(p){return p.sprites?.other?.['official-artwork']?.front_default||p.sprites?.front_default||''}
