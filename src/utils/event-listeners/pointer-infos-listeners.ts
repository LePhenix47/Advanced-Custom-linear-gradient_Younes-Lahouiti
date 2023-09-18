import { radiansToDegrees } from "@utils/helpers/math.helpers";
import { roundToFloat } from "@utils/helpers/number.helpers";
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
export function handlePointerMoveFromElement(
  event: PointerEvent,
  pointerInfos: PointerInfosType,
  element: HTMLElement
): void {
  event.preventDefault();

  const elementRect: DOMRect = element.getBoundingClientRect();

  pointerInfos.x = Math.round(event.x - elementRect.x);
  pointerInfos.y = Math.round(event.y - elementRect.y);
}

/**
 * Calculates the angle in degrees from the positive x-axis to the point (mouseX, mouseY) in the Cartesian plane.
 *
 * @param {number} mouseX - The x-coordinate of the point.
 * @param {number} mouseY - The y-coordinate of the point.
 *
 * @returns {number} The angle in degrees, normalized to be in the range of 0 to 360 degrees.
 */
export function calculateAngle(mouseX: number, mouseY: number): number {
  const angleInRadians: number = Math.atan2(mouseX, mouseY);

  let angleInDegrees: number = radiansToDegrees(angleInRadians);
  angleInDegrees = roundToFloat(angleInDegrees, 0);

  // Normalize angle to be in the range of 0 to 360 degrees
  const hasNegativeDegreesValue: boolean = angleInDegrees < 0;
  if (hasNegativeDegreesValue) {
    angleInDegrees += 360;
  }

  return angleInDegrees;
}

/**
 * Calculates the relative mouse coordinates (mouseX and mouseY) within the specified center element.
 *
 * @param {PointerEvent} e - The pointer event containing the mouse coordinates.
 * @param {HTMLDivElement} centerElement - The center element of the circle.
 *
 * @returns {{ mouseX: number, mouseY: number }} - The calculated mouseX and mouseY relative to the center element.
 */
export function calculateMouseCoordsFromCenter(
  e: PointerEvent,
  centerElement: HTMLElement
): { mouseX: number; mouseY: number } {
  // Get the position of the center element relative to the viewport
  const centerDotRect: DOMRect = centerElement.getBoundingClientRect();

  // Calculate the relative mouse coordinates
  const mouseX: number = e.x - centerDotRect.x;
  const mouseY: number = centerDotRect.y - e.y; // Inverted due to SVG coordinate system

  return { mouseX, mouseY };
}
