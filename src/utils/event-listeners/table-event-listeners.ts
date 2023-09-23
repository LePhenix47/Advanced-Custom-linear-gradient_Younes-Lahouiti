import { log } from "@utils/helpers/console.helpers";
import {
  getAncestor,
  getAttributeFrom,
  getClassListValues,
  getClone,
  getContentOfTemplate,
  getStyleProperty,
  removeChildInParent,
  selectById,
  selectFirstByClass,
  selectQuery,
  selectQueryAll,
  setAttributeFrom,
  setStyleProperty,
} from "@utils/helpers/dom.helpers";
import { calculateContrast } from "@utils/helpers/number.helpers";
import { formatStringCase } from "@utils/helpers/string.helpers";
import { handleDraggingClassToDraggable } from "./drag-n-drop-listeners";

// Initialized with the starting index

/**
 * Gets the number of rows in a table body.
 *
 * @returns {number} - The count of rows in the table body.
 */
export function getAmountOfRowsInTbody(): number {
  return selectQueryAll<HTMLTableRowElement>("tbody>tr").length + 1;
}

/**
 * Updates the index in the 2nd cell of each row in a table body.
 *
 * @param {HTMLTableSectionElement} tbody - The table body element containing the rows.
 * @returns {void}
 */
export function updateRows(tbody: HTMLTableSectionElement): void {
  const tableRowsArray = selectQueryAll<HTMLTableRowElement>("tr", tbody);

  const inputTypes: string[] = ["color", "offset", "opacity"];

  for (let i = 0; i < tableRowsArray.length; i++) {
    const row: HTMLTableRowElement = tableRowsArray[i];

    const cells = selectQueryAll<HTMLTableCellElement>("td", row);

    const currentOrder: number = i + 1;
    // Second cell for the index
    const paragraph = selectQuery<HTMLParagraphElement>("p", cells[1]);
    paragraph.textContent = `${currentOrder}.`;

    // For the third, fourth and fifth cells with the inputs
    for (let j = 0; j < inputTypes.length; j++) {
      const inputType: string = inputTypes[j];

      const label = selectQuery<HTMLLabelElement>("label", cells[j + 2]);
      const input = selectQuery<HTMLInputElement>("input", cells[j + 2]);

      const labelForAttributeValue: string = `input-${inputType}-${currentOrder}`;
      setAttributeFrom("for", labelForAttributeValue, label);
      setAttributeFrom("id", labelForAttributeValue, input);
    }

    // Fourth cell for the opacity
  }

  log(tableRowsArray);
}

/**
 * Clamps the value of an HTML input element within a specified range.
 *
 * @param {HTMLInputElement} input - The input element to clamp the value of.
 * @param {number} min - The minimum allowed value.
 * @param {number} max - The maximum allowed value.
 * @throws {TypeError} If the `input` parameter is not an HTMLInputElement.
 * @throws {TypeError|RangeError} If `min` or `max` is not a valid number, or if `min` is greater than `max`.
 */
export function clampInputValue(
  input: HTMLInputElement,
  min: number,
  max: number
): void {
  const notAnInput: boolean = !(input instanceof HTMLInputElement);
  if (notAnInput) {
    throw new TypeError(`Input parameter must be an input element`);
  }

  const areNotNumbers: boolean =
    typeof min !== "number" || typeof max !== "number";
  if (areNotNumbers) {
    throw new TypeError(`Invalid min and max values. Both must be numbers`);
  }

  const { isNaN } = Number;
  const areNaNValues: boolean = isNaN(min) || isNaN(max);
  if (areNaNValues) {
    throw new TypeError(`Invalid min and max values. Both must not be NaN`);
  }

  const hasInvalidRange: boolean = min > max;
  if (hasInvalidRange) {
    throw new RangeError(
      `Invalid min and max values, min > max: ${min} and max: ${max}`
    );
  }

  const overflows: boolean = input.valueAsNumber > max;
  if (overflows) {
    input.valueAsNumber = max;
  }

  const underflows: boolean = input.valueAsNumber < min;
  if (underflows) {
    input.valueAsNumber = min;
  }

  log(overflows, underflows);
}

/**
 * Callback that adds a new color row to the table, updating the index in the 2nd cell.
 *
 * @returns {void}
 */
export function addNewRowEntry(): void {
  const tableBody =
    selectFirstByClass<HTMLTableSectionElement>("menu__table-body");

  const defaultRowTemplate = selectFirstByClass<HTMLTemplateElement>(
    "template__non-conic-gradient"
  );

  const clonedRowDocumentFragment: DocumentFragment =
    getContentOfTemplate(defaultRowTemplate);

  const row = selectQuery<HTMLTableRowElement>("tr", clonedRowDocumentFragment);

  // Attach event listeners to color and number inputs in the new row
  const colorInput = selectQuery<HTMLInputElement>("input[type='color']", row);
  const numberInputs = selectQueryAll<HTMLInputElement>(
    "input[type='number']",
    row
  );

  // Handle color input changes
  colorInput.addEventListener("input", (e) => {
    const inputElement = e.currentTarget as HTMLInputElement;

    const cell = getAncestor<HTMLTableCellElement>(inputElement, "td");

    const hexColorValue: string = inputElement.value;

    const label = selectQuery<HTMLLabelElement>("label", cell);
    const labelHexColor: string = getStyleProperty("--_label-color", label);

    const { contrastRatio, respectsW3CGuidelines } = calculateContrast(
      hexColorValue,
      labelHexColor
    );

    const hasLowContrast: boolean = !respectsW3CGuidelines;
    if (hasLowContrast) {
      setStyleProperty(
        "--_label-color",
        labelHexColor === "#ffffff" ? "#000000" : "#ffffff",
        label
      );
    }

    label.textContent = formatStringCase(hexColorValue, "UPPERCASE");

    setStyleProperty("--_cell-bg-color", hexColorValue, cell);
    // Handle the color change (newValue) for this row.
  });

  for (const numberInput of numberInputs) {
    numberInput.addEventListener("input", (e) => {
      const input = e.currentTarget as HTMLInputElement;
      log(input.valueAsNumber);

      const isOpacityInput = input.id.includes("opacity");
      if (isOpacityInput) {
        const min: number = Number(getAttributeFrom("min", input));
        const max: number = Number(getAttributeFrom("max", input));

        clampInputValue(input, min, max);
      }

      // Handle the number change (newValue) for this row.
    });
  }

  row.addEventListener("dragstart", handleDraggingClassToDraggable);
  row.addEventListener("touchstart", handleDraggingClassToDraggable, {
    passive: true,
  });

  row.addEventListener("dragend", handleDraggingClassToDraggable);
  row.addEventListener("touchend", handleDraggingClassToDraggable);

  tableBody.appendChild(row);

  updateRows(tableBody);
}

/**
 * Event delegation for handling various table row operations.
 *
 * @param {MouseEvent} e - The mouse event triggered by a user action.
 * @returns {void}
 */
export function setTableRowsByDelegation(e: MouseEvent): void {
  const clickedElement = e.target as HTMLElement;

  const elementClasses: string[] = getClassListValues(clickedElement);

  const isUpOrderChanger: boolean = elementClasses[0].includes("top");
  const isDownOrderChanger: boolean = elementClasses[0].includes("bottom");
  const isDeleteButton: boolean = elementClasses[0].includes("delete");

  log(clickedElement);
  log(elementClasses);

  const clickedTheTBodyItself: boolean = formatStringCase(
    clickedElement.tagName,
    "lowercase"
  ).includes("tbody");

  if (clickedTheTBodyItself) {
    return;
  }

  const tableRow = getAncestor<HTMLTableRowElement>(clickedElement, "tr");
  const tableBody = getAncestor<HTMLTableSectionElement>(tableRow, "tbody");

  if (isUpOrderChanger) {
    incrementOrderOfRow(tableRow, tableBody);
  }
  if (isDownOrderChanger) {
    decrementOrderOfRow(tableRow, tableBody);
  }
  if (isDeleteButton) {
    deleteRow(tableRow, tableBody);
  }
}

function incrementOrderOfRow(
  rowElement: HTMLTableRowElement,
  tbody: HTMLTableSectionElement
): void {
  const tableRowsArray = selectQueryAll<HTMLTableRowElement>("tr", tbody);

  const currentIndex: number = tableRowsArray.indexOf(rowElement);
  const hasNoRows: boolean = currentIndex === -1;
  if (hasNoRows) {
    console.error("Row not found in the table body.");
    return;
  }

  const isNotFirstRow: boolean = currentIndex > 0;
  if (isNotFirstRow) {
    const previousRow: HTMLTableRowElement = tableRowsArray[currentIndex - 1];
    // Swap rows with the previous row to increment the order
    tbody.insertBefore(rowElement, previousRow);
    // Update the row indexes
    updateRows(tbody);
  }
}

function decrementOrderOfRow(
  rowElement: HTMLTableRowElement,
  tbody: HTMLTableSectionElement
): void {
  const tableRowsArray = selectQueryAll<HTMLTableRowElement>("tr", tbody);

  const currentIndex: number = tableRowsArray.indexOf(rowElement);
  const hasNoRows: boolean = currentIndex === -1;
  if (hasNoRows) {
    console.error("Row not found in the table body.");
    return;
  }

  const isNotLastRow: boolean = currentIndex < tableRowsArray.length - 1;
  if (isNotLastRow) {
    const nextRow: HTMLTableRowElement = tableRowsArray[currentIndex + 1];
    // Swap rows with the next row to decrement the order
    tbody.insertBefore(nextRow, rowElement);
    // Update the row indexes
    updateRows(tbody);
  }
}

/**
 * Deletes a row from the table and updates row indexes.
 *
 * @param {HTMLTableRowElement} rowElement - The table row element to delete.
 * @param {HTMLTableSectionElement} tbody - The table body element containing the row.
 * @returns {void}
 */
function deleteRow(
  rowElement: HTMLTableRowElement,
  tbody: HTMLTableSectionElement
): void {
  log("deleteRow", rowElement, "tbody", tbody);

  removeChildInParent(tbody, rowElement);

  updateRows(tbody);
}
