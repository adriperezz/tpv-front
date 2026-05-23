const KEY = 'tpv_impresora';
const TTL = 8 * 60 * 60 * 1000; // 8h

interface ImpresoraConfig {
  ip: string;
  nombre: string;
  savedAt: number;
}

export function getImpresora(): ImpresoraConfig | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  const config: ImpresoraConfig = JSON.parse(raw);
  if (Date.now() - config.savedAt > TTL) {
    localStorage.removeItem(KEY);
    return null;
  }
  return config;
}

export function saveImpresora(ip: string, nombre: string) {
  localStorage.setItem(KEY, JSON.stringify({ ip, nombre, savedAt: Date.now() }));
}

export function clearImpresora() {
  localStorage.removeItem(KEY);
}
