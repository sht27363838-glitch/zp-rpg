// src/utils/asArray.js
export const asArray = (v) => {
  if (Array.isArray(v)) return v
  if (v && typeof v === 'object') return Object.values(v) // 혹시 객체로 올 때
  return []
}
