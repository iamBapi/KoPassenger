/** Recursively trim string values in JSON body (before validation). */
export function trimBody(req, _res, next) {
  if (req.body && typeof req.body === "object") {
    req.body = trimStrings(req.body);
  }
  next();
}

function trimStrings(obj) {
  if (Array.isArray(obj)) {
    return obj.map(trimStrings);
  }
  if (obj && typeof obj === "object") {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = typeof v === "string" ? v.trim() : trimStrings(v);
    }
    return out;
  }
  return obj;
}
