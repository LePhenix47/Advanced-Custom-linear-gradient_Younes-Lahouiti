import { pointerInfos } from "@utils/variables/global-states/pointer-infos";

/**
 * Handles pointer down and up events to update the global state.
 *
 * @param {PointerEvent} event - The PointerEvent object.
 *
 * @returns {void}
 */
export function handlePointerUpDown(event: PointerEvent): void {
  event.preventDefault();

  const usedLeftClick = event.pointerType === "mouse" && event.button === 0;
  const usedTouch = event.pointerType === "touch";

  const hasPointedToADirection = usedLeftClick || usedTouch;
  if (hasPointedToADirection) {
    pointerInfos.isPressing = event.type === "pointerdown";
  }
}

/**
 * Handles pointer move events to update the global state with cursor coordinates.
 *
 * @param {PointerEvent} event - The PointerEvent object.
 *
 * @returns {void}
 */
export function handlePointerMove(event: PointerEvent): void {
  event.preventDefault();

  pointerInfos.x = Math.round(event.x);
  pointerInfos.y = Math.round(event.y);
}
