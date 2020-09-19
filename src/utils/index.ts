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
