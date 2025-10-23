// /src/utils/asArray.js
export function asArray(v) {
  if (Array.isArray(v)) return v;
  if (v && Array.isArray(v.items)) return v.items;
  if (v && typeof v === 'object') return Object.values(v);
  return [];
}
