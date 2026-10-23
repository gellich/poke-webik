import { UIComponent } from '../core/UIComponent.js';
export class NotesWidget extends UIComponent {
 constructor(ctx){super({...ctx,id:'notes',title:ctx.t('notes')})}
 renderBody(){const label=document.createElement('label');label.textContent=this.t('noteLabel');const area=document.createElement('textarea');area.rows=7;area.maxLength=3000;area.placeholder=this.t('noteHint');area.value=this.storage.get('note','');area.addEventListener('input',()=>this.storage.set('note',area.value),{signal:this.controller.signal});label.append(area);this.body.append(label)}
}
