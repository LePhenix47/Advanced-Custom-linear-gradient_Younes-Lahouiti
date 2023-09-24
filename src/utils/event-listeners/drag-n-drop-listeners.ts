import {
  addClass,
  removeClass,
  selectQuery,
  selectQueryAll,
} from "@utils/helpers/dom.helpers";
import { updateRows } from "./table-event-listeners";

// Function for the draggable containers, container.addEventListener("dragover", append draggable to container)
/**
 * Handles the dragover event on the container element for dragging elements.
 *
 * @param {DragEvent | TouchEvent} event - The dragover or touchmove event.
 * @returns {void}
 */
export function handleContainerDraggingElementDragOver(
  event: DragEvent | TouchEvent
): void {
  //Prevent the default behavior of the browser to enable element dropping
  event.preventDefault();

  const container: HTMLElement = event.currentTarget as HTMLElement;

  const pointerYPosition: number =
    event.type === "dragover"
      ? (event as DragEvent).clientY
      : (event as TouchEvent).touches[0].clientY;

  const draggedDraggable = selectQuery<HTMLElement>(".dragging");

  const hasNoDraggable: boolean = !draggedDraggable;
  if (hasNoDraggable) {
    throw new Error("No draggable was found!");
  }

  //Closest element from the mouse
  const closestElement: HTMLElement | null = getClosestElementFromPointer(
    container,
    pointerYPosition
  );
  //
  const hasNoAfterElement: boolean = closestElement === null;
  if (hasNoAfterElement) {
    //We add it at the end of the container
    container.appendChild(draggedDraggable);
  } else {
    //We add it in front of the closest element
    container.insertBefore(draggedDraggable, closestElement);
  }

  updateRows(container as HTMLTableSectionElement);
}

/**
 * Finds the closest element to the pointer's position within a container.
 *
 * @param {HTMLElement} container - The container element.
 * @param {number} pointerYPosition - The Y position of the pointer.
 * @param {boolean} [findVertically=true] - Whether to find the closest element vertically or horizontally.
 *
 * @returns {HTMLElement | null} The closest element to the pointer's position, or null if no elements found.
 */
export function getClosestElementFromPointer(
  container: HTMLElement,
  pointerYPosition: number,
  findVertically: boolean = true
): HTMLElement | null {
  const staticDraggablesArray: HTMLElement[] = selectQueryAll<HTMLElement>(
    "[draggable]:not(.dragging)",
    container
  );

  //We initialize 2 variables to get the closest element
  //and the the closest offset nearing the most 0
  let closestElement: HTMLElement | null = null;
  let closestOffset: number = Number.NEGATIVE_INFINITY;

  for (const staticDraggable of staticDraggablesArray) {
    //We get the cooridnates and dimensions of the draggable
    const { top, height, left, width } =
      staticDraggable.getBoundingClientRect();

    //We compute the offset between the draggable and the mouse position
    const currentOffset: number = findVertically
      ? pointerYPosition - (top + height / 2)
      : pointerYPosition - (left + width / 2);

    const isAboveAfterElement: boolean = currentOffset < 0;
    const hasGreatestOffset: boolean = currentOffset > closestOffset;

    if (isAboveAfterElement && hasGreatestOffset) {
      closestOffset = currentOffset;
      closestElement = staticDraggable;
    }
  }

  return closestElement;
}

// Function for the draggables themselves
/*

    draggable.addEventListener("dragstart", handleDraggingClassToDraggable);
    draggable.addEventListener("touchstart", handleDraggingClassToDraggable, {
      passive: true,
    });

    draggable.addEventListener("dragend", handleDraggingClassToDraggable);
    draggable.addEventListener("touchend", handleDraggingClassToDraggable);
*/

export function handleDraggingClassToDraggable(
  event: DragEvent | TouchEvent
): void {
  const draggable = event.target as HTMLElement;

  const isDragging: boolean = event.type.includes("start");
  if (isDragging) {
    addClass(draggable, "dragging");
  } else {
    removeClass(draggable, "dragging");
  }
}
