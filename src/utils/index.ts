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
