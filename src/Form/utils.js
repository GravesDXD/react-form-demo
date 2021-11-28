/**
 *
 * @param {any} obj
 * @returns {boolean}
 */
export function isObject(obj) {
  return obj !== null && typeof obj === "object";
}

/**
 *
 * @param {any} obj
 * @param {string} path
 * @returns {any}
 */
export function deepGet(obj, path) {
  const parts = path.split(".");
  const length = parts.length;

  for (let i = 0; i < length; i++) {
    if (!isObject(obj)) return undefined;
    obj = obj[parts[i]];
  }

  return obj;
}

/**
 *
 * @param {any} obj
 * @param {string} path
 * @param {any} value
 * @returns {any}
 */
export function deepSet(obj, path, value) {
  if (!isObject(obj)) return obj;

  const root = obj;
  const parts = path.split(".");
  const length = parts.length;

  for (let i = 0; i < length; i++) {
    const p = parts[i];

    if (i === length - 1) {
      obj[p] = value;
    } else if (!isObject(obj[p])) {
      obj[p] = {};
    }

    obj = obj[p];
  }

  return root;
}

export function deepCopy(target) {
  const type = typeof target;

  if (
    target === null ||
    type === "boolean" ||
    type === "number" ||
    type === "string"
  ) {
    return target;
  }

  if (target instanceof Date) {
    return new Date(target.getTime());
  }

  if (Array.isArray(target)) {
    return target.map((o) => deepCopy(o));
  }

  if (typeof target === "object") {
    const obj = {};

    for (let key in target) {
      obj[key] = deepCopy(target[key]);
    }

    return obj;
  }

  return undefined;
}

/**
 * 
 * @param {string | function name(params) {
     
 }} valueProp 
 * @param {any} type 
 * @returns 
 */
export function getPropName(valueProp, type) {
  return typeof valueProp === "function" ? valueProp(type) : valueProp;
}

export function getValueFromEvent(...args) {
  const e = args[0];
  return e && e.target
    ? e.target.type === "checkbox"
      ? e.target.checked
      : e.target.value
    : e;
}
