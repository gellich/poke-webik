// Game mechanics are intentionally gentle. No pet can die or disappear.
const DEFAULT={hunger:85,energy:90,mood:90,friendship:50,level:1,xp:0};
const clamp=(v,min=0,max=100)=>Math.min(max,Math.max(min,Number.isFinite(Number(v))?Number(v):min));
export class PetManager {
 constructor(storage){this.storage=storage;this.listeners=new Set();this.pet=null;this.load();}
 load(){const raw=this.storage.get('companion',null);if(!raw||!Number.isInteger(Number(raw.id)))return null;const updated={...raw};for(const k of ['hunger','energy','mood','friendship'])updated[k]=clamp(raw[k]??DEFAULT[k]);updated.level=Math.max(1,Math.floor(Number(raw.level)||1));updated.xp=Math.max(0,Math.floor(Number(raw.xp)||0));updated.lastUpdated=Number.isFinite(Number(raw.lastUpdated))?Number(raw.lastUpdated):Date.now();updated.actions=raw.actions&&typeof raw.actions==='object'?raw.actions:{};this.pet=updated;this.tick();return this.pet}
 get(){return this.pet}
 tick(){if(!this.pet)return;const now=Date.now();const hours=clamp((now-this.pet.lastUpdated)/3600000,0,48);if(hours>=1/60){this.pet.hunger=clamp(this.pet.hunger-Math.min(18,hours*.42));this.pet.energy=clamp(this.pet.energy-Math.min(12,hours*.20));this.pet.mood=clamp(this.pet.mood-Math.min(10,hours*.16));this.pet.lastUpdated=now;this.save()}}
 save(){if(this.pet)this.storage.set('companion',this.pet);this.listeners.forEach(fn=>fn(this.pet))}
 onChange(fn){this.listeners.add(fn);return()=>this.listeners.delete(fn)}
 act(action){this.tick();if(!this.pet)return {ok:false,reason:'missing'};const p=this.pet;const now=Date.now();const intervals={feed:10000,pet:3000,play:12000,rest:10000};if(!intervals[action])return {ok:false,reason:'invalid'};if(now-(Number(p.actions[action])||0)<intervals[action])return{ok:false,reason:'cooldown',seconds:Math.ceil((intervals[action]-(now-p.actions[action]))/1000)};
 const effects={feed:{hunger:22,mood:3,xp:3,friendship:1},pet:{mood:10,friendship:4,xp:2},play:{energy:-16,hunger:-8,mood:17,friendship:5,xp:10},rest:{energy:26,hunger:-3,mood:3,xp:2}};
 if(action==='play'&&p.energy<16)return{ok:false,reason:'tired'};
 const d=effects[action];for(const key of ['hunger','energy','mood','friendship'])if(d[key])p[key]=clamp(p[key]+d[key]);p.xp+=d.xp;while(p.xp>=p.level*40){p.xp-=p.level*40;p.level+=1;p.friendship=clamp(p.friendship+2)}p.actions[action]=now;p.lastUpdated=now;this.storage.set('care-actions',(Number(this.storage.get('care-actions',0))||0)+1);this.save();return{ok:true,action};}
 rename(raw){if(!this.pet)return false;const name=String(raw??'').trim().slice(0,24);if(!name)return false;this.pet.name=name;this.save();return true}
 getState(){const p=this.pet;if(!p)return 'missing';if(p.energy<25)return 'sleepy';if(p.hunger<25)return 'hungry';if(p.mood<35)return 'sad';if(p.mood>78&&p.energy>45)return 'happy';return 'calm'}
}
