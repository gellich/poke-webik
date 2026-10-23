import {UIComponent} from '../core/UIComponent.js';
import {ACHIEVEMENTS,statsFrom,trainerLevel,unlockAchievements} from '../game/achievements.js';
export class ProfileWidget extends UIComponent{
 constructor(ctx){super({...ctx,id:'profile',title:ctx.t('trainerCard')})}
 renderBody(){this.body.replaceChildren();const s=statsFrom(this.storage),ids=unlockAchievements(this.storage);const lang=this.t('locale');
 const level=document.createElement('p');level.className='trainer-big';level.textContent=`${this.t('level')} ${trainerLevel(s.xp)} ✦`;
 const line=document.createElement('p');line.className='trainer-muted';line.textContent=`${this.t('xp')}: ${s.xp} · ${this.t('coins')}: ${s.coins} · ${this.t('completed')}: ${s.completed}`;
 const bar=document.createElement('progress');bar.max=100;bar.value=s.xp%100;bar.setAttribute('aria-label',this.t('nextLevel'));
 const sub=document.createElement('p');sub.className='trainer-muted';sub.textContent=this.t('nextLevel')+': '+(100-s.xp%100)+' XP';
 const grid=document.createElement('div');grid.className='achievement-mini';for(const a of ACHIEVEMENTS){const item=document.createElement('div');const won=ids.has(a.id);item.className='achievement-chip'+(won?' unlocked':'');item.textContent=a.icon+' '+(lang==='ru'?a.ru:a.en)+(won?' ✓':' 🔒');item.title=lang==='ru'?a.ruDesc:a.enDesc;grid.append(item)}
 this.body.append(level,line,bar,sub,grid)}
}
