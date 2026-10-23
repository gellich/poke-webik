export class StorageManager {
  constructor(namespace = 'pokepuk-v2') { this.namespace = namespace; this.memory = {}; this.available = true; try { const k = `${namespace}:test`; localStorage.setItem(k, '1'); localStorage.removeItem(k); } catch { this.available = false; } }
  get(key, fallback) { try { const raw = this.available ? localStorage.getItem(`${this.namespace}:${key}`) : this.memory[key]; return raw == null ? structuredClone(fallback) : JSON.parse(raw); } catch { return structuredClone(fallback); } }
  set(key, value) { try { const raw = JSON.stringify(value); if(this.available) localStorage.setItem(`${this.namespace}:${key}`, raw); else this.memory[key] = raw; return true; } catch { return false; } }
}
