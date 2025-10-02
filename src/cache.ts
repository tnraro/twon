const cache = new Map<string, { createdAt: string; value: string }>();
export function get(key: string, resolver: () => string) {
  const cached = cache.get(key);
  const today = getToday();
  if (cached != null && cached.createdAt === today) {
    return cached.value;
  }
  const value = resolver();
  cache.set(key, { createdAt: today, value });
  return value;
}
export function prune() {
  const today = getToday();
  cache.forEach((cached, key, cache) => {
    if (cached.createdAt === today) return;
    cache.delete(key);
  });
}
function getToday() {
  return new Date().toLocaleDateString();
}
