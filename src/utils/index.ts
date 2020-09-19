import { customAlphabet } from 'nanoid';
const ALPHA_NUM_STRING =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Generate a unique 12 char id
 */
export const genID = customAlphabet(ALPHA_NUM_STRING, 12);

export const sleep = async (ms: number): Promise<void> => {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, ms);
  });
};

/**
 * Deep copies an object and returns it
 * @param obj
 */
export function deepCopy<T>(obj: T): T {
  let copy;
  // Handle the 3 simple types, and null or undefined
  if (null == obj || 'object' != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (let i = 0, len = obj.length; i < len; i++) {
      copy[i] = deepCopy(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (const attr in obj) {
      //eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(attr)) copy[attr] = deepCopy(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}

export const deepMerge = (obj1: any, obj2: any, clobberArrays = false): any => {
  if (obj2 == undefined || obj2 == null) return obj1;
  const rootKeys = Object.keys(obj2);

  rootKeys.forEach((key: string) => {
    // if obj2 field is not an object and not an array, override obj1
    if (
      typeof obj2[key] !== 'object' &&
      obj2[key] &&
      obj2[key].constructor.name !== 'Array'
    ) {
      obj1[key] = obj2[key];
    }

    // otherwise if obj2 field is an array and the same field in obj1 is also an array
    else if (
      obj2[key] &&
      obj2[key].constructor.name == 'Array' &&
      obj1[key] &&
      obj1[key].constructor.name == 'Array'
    ) {
      // replacce array if clobberArrays is set to true
      if (clobberArrays) {
        obj1[key] = obj2[key];
      }
      // then merge the arrays if clobberArrays is false
      else {
        obj1[key].push(...obj2[key]);
      }
    } else {
      if (obj1[key] && typeof obj1[key] === 'object') {
        //If object 1 also shares a the same key as object 2 and is also an object, proceed with recursion
        obj1[key] = deepMerge(obj1[key], obj2[key], clobberArrays);
      } else {
        //Otherwise, overwrite
        obj1[key] = obj2[key];
      }
    }
  });
  return obj1;
};
