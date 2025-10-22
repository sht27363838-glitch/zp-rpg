/// src/utils/asArray.js
export function asArray(v) {
  if (Array.isArray(v)) return v
  if (v === null || v === undefined) return []
  return [v]
}

export default asArray
