import { PointerInfosType } from "@utils/variables/global-states/pointer-infos";

/**
 * Handles pointer down and up events to update the global state.
 *
 * @param {PointerEvent} event - The PointerEvent object.
 *
 * @returns {void}
 */
export function handlePointerUpDown(
  event: PointerEvent,
  pointerInfos: PointerInfosType
): void {
  event.preventDefault();

  const usedLeftClick: boolean =
    event.pointerType === "mouse" && event.button === 0;

  const usedTouch: boolean = event.pointerType === "touch";

  const hasPointedToADirection: boolean = usedLeftClick || usedTouch;
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
export function handlePointerMove(
  event: PointerEvent,
  pointerInfos: PointerInfosType,
  canvas: HTMLCanvasElement
): void {
  event.preventDefault();

  const canvasRect: DOMRect = canvas.getBoundingClientRect();

  pointerInfos.x = Math.round(event.x - canvasRect.x);
  pointerInfos.y = Math.round(event.y - canvasRect.y);
}
