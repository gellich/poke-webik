import {TRAITS,POKEMON_PROFILES} from './pokemonProfiles.js';
import {QUESTIONS} from './questions.js';
import {getPokemon} from '../api/pokeApi.js';
const clamp=(n)=>Math.min(100,Math.max(0,n));
export function userProfile(answers){const sums=Array(6).fill(0);for(let i=0;i<QUESTIONS.length;i++){const choice=QUESTIONS[i].options[answers[i]];if(choice)choice.delta.forEach((n,k)=>sums[k]+=n)}
// Every trait starts neutral; scaling keeps 12 x ~20 contributions within 0..100.
return sums.map(n=>clamp(Math.round(50+n/5)));}
function apiAdjust(data){if(!data)return null;const s=Object.fromEntries(data.stats.map(x=>[x.stat.name,x.base_stat]));const speed=clamp((s.speed||0)/1.6),attack=clamp((s.attack||0)/1.6),defense=clamp((s.defense||0)/1.6),special=clamp((s['special-attack']||0)/1.6);return [speed,50, special,attack,50,defense];}
export function scorePokemon(user, pokemon, apiData=null){const derived=apiAdjust(apiData);const traits=pokemon.traits.map((n,i)=>derived&&[0,2,3,5].includes(i)?Math.round(n*.85+derived[i]*.15):n);
const weights=[1,1.15,1.05,1,1.2,1];const distance=Math.sqrt(traits.reduce((sum,val,i)=>sum+weights[i]*(val-user[i])**2,0)/weights.reduce((s,x)=>s+x,0));
return { ...pokemon,traits,score:Math.max(0,Math.min(100,Math.round(100-distance))),apiUsed:!!derived};}
// Network failures do not invent statistics: the explicit local game archetypes remain available.
export async function rankPokemon(answers,signal){const user=userProfile(answers);const api=new Map();let index=0;
const worker=async()=>{while(index<POKEMON_PROFILES.length){if(signal?.aborted)throw new DOMException('Aborted','AbortError');const candidate=POKEMON_PROFILES[index++];try{api.set(candidate.id,await getPokemon(candidate.id,signal))}catch(error){if(error.name==='AbortError')throw error;}}};
await Promise.all(Array.from({length:6},()=>worker()));const matches=POKEMON_PROFILES.map(p=>scorePokemon(user,p,api.get(p.id)));
matches.sort((a,b)=>b.score-a.score||a.id-b.id);return {user,matches,apiCount:api.size};}
export function reasons(user,p,lang){const names=lang==='en'?['energy','warmth','curiosity','courage','sensitivity','independence']:['энергичность','общительность','любознательность','смелость','чуткость','самостоятельность'];
const diffs=p.traits.map((n,i)=>({i,d:Math.abs(n-user[i])})).sort((a,b)=>a.d-b.d);const a=names[diffs[0].i],b=names[diffs[1].i];return lang==='en'?`You both share a similar ${a} and ${b}.`:`Вас сближают ${a} и ${b}.`;}
