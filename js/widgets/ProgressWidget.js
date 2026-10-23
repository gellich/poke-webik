import { UIComponent } from '../core/UIComponent.js';
export class ProgressWidget extends UIComponent {
 constructor(ctx){super({...ctx,id:'progress',title:ctx.t('progressWidget')})}
 renderBody(){const data=this.storage.get('trainer',{xp:0,coins:0,friendship:0,completed:0});const rows=[[this.t('xp'),data.xp],[this.t('coins'),data.coins],[this.t('friendship'),data.friendship],[this.t('completed'),data.completed]];for(const [label,value] of rows){const p=document.createElement('p');p.className='progress-row';const name=document.createElement('span');name.textContent=label;const amount=document.createElement('strong');amount.textContent=String(value);p.append(name,amount);this.body.append(p)}}
}
