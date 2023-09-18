export type PointerInfosType = {
  x: number;
  y: number;
  isPressing: boolean;
};

/**
 * The X and Y coordinates and pressing state of the cursor in the page
 */
export const pointerInfos: PointerInfosType = {
  x: NaN,
  y: NaN,
  isPressing: false,
};
