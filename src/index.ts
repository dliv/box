const flag = ((k: string) => (typeof Symbol !== 'function' ? k : Symbol.for(k)))(
  'box-flag-2b6a464c',
);

/**
 * Boxes are mutable references to a single value.
 */
type Box<T> = [T, typeof flag];

/**
 * A BoxLike is similar enough to a Box to work with box methods: `unbox` and `setBox$`.
 */
export type BoxLike<T> = { [k: number]: T };

/**
 * Put the item in a Box.
 *
 * @param item item to box
 */
export const box = <T>(item: T): Box<T> => [item, flag];

/**
 * Get the item in the Box.
 *
 * @param box the box to retrieve an item from
 */
export const unbox = <T>(box: Box<T> | BoxLike<T>): T => box[0];

/**
 * Change the contents of a box.
 *
 * @param box a box (or box-like object) to change
 * @param val new box contents
 */
export const setBox$ = <T>(box: Box<T> | BoxLike<T>, val: T): T => (box[0] = val);

/**
 * Is this a Box?
 *
 * Method is a TypeScript type guard.
 *
 * @param val a value which may be a Box
 * @returns true if this value came from method `box`
 */
export const isBox = (val: unknown): val is Box<unknown> =>
  Array.isArray(val) && val.length === 2 && val[1] === flag;

/**
 * Is the thing box-like enough to work.
 *
 * Method is a TypeScript type guard.
 *
 * @param val something that may not have come from ts-boxed but might work
 * @returns true if this value will work with box methods: `unbox` and `setBox$`
 */
export const isBoxy = (val: unknown): val is BoxLike<unknown> =>
  Boolean(val) && (Object.hasOwnProperty.call(val, '0') || Object.isExtensible(val));
