export class Router {
  constructor(render) { this.render = render; this.onHash = () => this.navigate(); window.addEventListener('hashchange', this.onHash); }
  navigate() { const routes = ['welcome','soulmatch','daycare','dashboard','pokedex','collection','profile']; const requested = location.hash.slice(1).split('/')[0]; const route = routes.includes(requested) ? requested : 'welcome'; this.render(route); document.querySelectorAll('.nav a').forEach(a => { const active = a.getAttribute('href') === `#${route}`; a.classList.toggle('active',active); if(active) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); }); }
  destroy() { window.removeEventListener('hashchange',this.onHash); }
}
