import { UIComponent } from '../core/UIComponent.js';
export class MoodWidget extends UIComponent {
  constructor(options) { super({...options,id:'mood',title:options.t('moodTitle')});this.t=options.t; }
  renderContent() {
    this.body.append(this.element('p','widget-label',this.t('moodPrompt')));
    const row=this.element('div','mood-options');
    for (const mood of ['🌧️','🌥️','🌸','☀️','✨']) {
      const button=this.element('button','mood-btn',mood);button.type='button';button.setAttribute('aria-label',mood);
      this.listen(button,'click',()=>{this.storage.set('mood',mood); this.updateMood(row);});
      row.append(button);
    }
    this.body.append(row);this.updateMood(row);
  }
  updateMood(row) {const mood=this.storage.get('mood','');for(const button of row.children) {const selected=button.textContent===mood;button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));}}
}
