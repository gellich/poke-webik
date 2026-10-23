// Every achievement is derived from durable game state; no repeatable reward button.
export const ACHIEVEMENTS = [
 {id:'firstMission', icon:'✦', ru:'Первая миссия',en:'First Mission', ruDesc:'Выполни первую задачу',enDesc:'Complete your first task', check:s=>s.completed>=1},
 {id:'taskMaster', icon:'★',ru:'Мастер задач',en:'Task Master',ruDesc:'Выполни 20 задач',enDesc:'Complete 20 tasks',check:s=>s.completed>=20},
 {id:'bestFriends',icon:'♡',ru:'Лучшие друзья',en:'Best Friends',ruDesc:'Достигни 90 дружбы с питомцем',enDesc:'Reach 90 pet friendship',check:s=>s.petFriendship>=90},
 {id:'caretaker',icon:'✿',ru:'Заботливый хозяин',en:'Cozy Caretaker',ruDesc:'Сделай 15 действий ухода',enDesc:'Care for your Pokémon 15 times',check:s=>s.careActions>=15},
 {id:'explorer',icon:'◈',ru:'Исследователь',en:'Pokédex Explorer',ruDesc:'Встреть 10 видов покемонов',enDesc:'Meet 10 Pokémon species',check:s=>s.collection>=10},
 {id:'soulmate',icon:'❀',ru:'Родственная душа',en:'Soulmate',ruDesc:'Выбери компаньона через Soulmatch',enDesc:'Choose your Soulmatch companion',check:s=>s.hasPet},
];
export function trainerLevel(xp){const safe=Math.max(0,Number(xp)||0);return Math.floor(safe/100)+1}
export function statsFrom(storage){const t=storage.get('trainer',{}),p=storage.get('companion',null),c=storage.get('collection',[]),actions=storage.get('care-actions',0);return {xp:Math.max(0,Number(t.xp)||0),coins:Math.max(0,Number(t.coins)||0),friendship:Math.max(0,Number(t.friendship)||0),completed:Math.max(0,Number(t.completed)||0),collection:Array.isArray(c)?c.length:0,careActions:Math.max(0,Number(actions)||0),petFriendship:Number(p?.friendship)||0,hasPet:!!p,pet:p}}
export function unlockAchievements(storage){const stats=statsFrom(storage),saved=storage.get('achievements',[]),ids=new Set(Array.isArray(saved)?saved:[]);for(const item of ACHIEVEMENTS)if(item.check(stats))ids.add(item.id);storage.set('achievements',[...ids]);return ids}
