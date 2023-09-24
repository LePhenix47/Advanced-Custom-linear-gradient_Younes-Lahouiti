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
import { GradientColorStop } from "@utils/classes/states/index-gradients.class";
import {
  getAllStopColorStateValuesFromTable,
  gradientInfos,
  resetStopColorsState,
  setStopColorPropertyById,
} from "@utils/variables/global-states/gradient-infos";
import { log } from "@utils/helpers/console.helpers";

export function resetTableRows() {
  const tableBody =
    selectFirstByClass<HTMLTableSectionElement>("menu__table-body");

  tableBody.innerHTML = "";

  resetStopColorsState();
}

// Initialized with the starting index

/**
 * Gets the number of rows in a table body.
 *
 * @returns {number} - The count of rows in the table body.
 */
export function getAmountOfRowsInTbody(): number {
  return selectQueryAll<HTMLTableRowElement>("tbody>tr").length + 1;
}

type ConicGradientColorStop = Extract<GradientColorStop, { startAngle: any }>;
type NonConicGradientColorStop = Extract<GradientColorStop, { offset: any }>;

/**
 * Updates the index in the 2nd cell of each row in a table body.
 *
 * @param {HTMLTableSectionElement} tbody - The table body element containing the rows.
 * @returns {void}
 */
export function updateRows(tbody: HTMLTableSectionElement): void {
  const tableRowsArray = selectQueryAll<HTMLTableRowElement>("tr", tbody);
  const isConicGradient: boolean = gradientInfos.type === "conic";

  for (let i = 0; i < tableRowsArray.length; i++) {
    const currentIndex = i + 1;

    const row: HTMLTableRowElement = tableRowsArray[i];

    const cells = selectQueryAll<HTMLTableCellElement>("td", row);

    /*    
      We start at the 2nd cell and finish at the penultimate one
    (omitting the order buttons and delete stop color)

      and get the values of the inputs to create the stop colors
    */
    for (let j = 1; j < cells.length - 1; j++) {
      const cell: HTMLTableCellElement = cells[j];

      if (isConicGradient) {
        switch (j) {
          case 1: {
            const paragraph = selectQuery<HTMLParagraphElement>("p", cell);
            paragraph.textContent = `${currentIndex}.`;
            break;
          }
          default:
            break;
        }
      } else {
        switch (j) {
          case 1: {
            const paragraph = selectQuery<HTMLParagraphElement>("p", cell);
            paragraph.textContent = `${currentIndex}.`;
            break;
          }

          case 2:
          case 3:
          case 4: {
            const label = selectQuery<HTMLLabelElement>("label", cell);
            const inputTypeArray = getAttributeFrom("for", label).split("-");
            inputTypeArray.splice(0, 1);

            const inputType: string = inputTypeArray[0];

            const input = selectQuery<HTMLInputElement>("input", cell);

            const labelForAttributeValue: string = `input-${inputType}-${currentIndex}`;
            setAttributeFrom("for", labelForAttributeValue, label);
            setAttributeFrom("id", labelForAttributeValue, input);
            break;
          }

          default:
            break;
        }
      }
    }
  }

  getAllStopColorStateValuesFromTable();
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
      `Invalid min and max values, min > max, got values for min: ${min} and max: ${max}`
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

  const hasNaNInputValue: boolean = isNaN(input.valueAsNumber);
  if (hasNaNInputValue) {
    input.valueAsNumber = 0;
  }
}

/**
 * Callback that adds a new color row to the table, updating the index in the 2nd cell.
 *
 * @returns {void}
 */
export function addNewRowEntry(): void {
  const tableBody =
    selectFirstByClass<HTMLTableSectionElement>("menu__table-body");

  const isConicGradient: boolean = gradientInfos.type === "conic";

  const defaultRowTemplate = selectFirstByClass<HTMLTemplateElement>(
    isConicGradient
      ? "template__conic-gradient"
      : "template__non-conic-gradient"
  );

  const row = selectQuery<HTMLTableRowElement>("tr", defaultRowTemplate);

  tableBody.appendChild(row);

  updateRows(tableBody);

  // Now that we updated the last row, we can add the other event listeners
  const latestRow = selectQuery<HTMLTableRowElement>(
    "tr:last-child",
    tableBody
  );

  if (isConicGradient) {
  } else {
    addEventListenersToNonConicRow(latestRow);
  }

  latestRow.addEventListener("dragstart", handleDraggingClassToDraggable);
  latestRow.addEventListener("touchstart", handleDraggingClassToDraggable, {
    passive: true,
  });

  latestRow.addEventListener("dragend", handleDraggingClassToDraggable);
  latestRow.addEventListener("touchend", handleDraggingClassToDraggable);
}

function addEventListenersToNonConicRow(row: HTMLTableRowElement) {
  const rowParagraphForIndex = selectQuery<HTMLParagraphElement>(
    ".menu__table-cell:nth-child(2) .menu__table-cell-index",
    row
  );
  const rowIndex: number = Number(rowParagraphForIndex.innerText);

  // Attach event listeners to color and number inputs in the new row
  const colorInput = selectQuery<HTMLInputElement>("input[type=color]", row);
  // Handle color input changes
  colorInput.addEventListener("input", (e: Event) => {
    setColorInput(e, rowIndex);
  });

  const offsetInput = selectQuery<HTMLInputElement>(
    "input[type=number]:not([min])",
    row
  );
  offsetInput.addEventListener("input", (e: Event) => {
    setOffsetInput(e, rowIndex);
  });

  const opacityInput = selectQuery<HTMLInputElement>(
    "input[type=number]:is([min])",
    row
  );
  opacityInput.addEventListener("input", (e: Event) => {
    setOpacityInput(e, rowIndex);
  });

  log(offsetInput, opacityInput);
}

function addEventListenersToConicRow(row: HTMLTableRowElement) {
  const rowParagraphForIndex = selectQuery(
    ".menu__table-cell:nth-child(2) .menu__table-cell-index",
    row
  );

  const rowIndex: number = Number(
    rowParagraphForIndex.textContent.replaceAll(".", "")
  );

  // Attach event l
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
  removeChildInParent(tbody, rowElement);

  updateRows(tbody);
}

// CELLS EVENT LISTENERS
function setColorInput(e: Event, rowIndex: number) {
  const inputElement = e.currentTarget as HTMLInputElement;

  const cell = getAncestor<HTMLTableCellElement>(inputElement, "td");

  const hexColorValue: string = inputElement.value;

  const label = selectQuery<HTMLLabelElement>("label", cell);
  const labelHexColor: string = getStyleProperty("--_label-color", label);

  const { respectsW3CGuidelines } = calculateContrast(
    hexColorValue,
    labelHexColor
  );
  setStopColorPropertyById(rowIndex, "color", hexColorValue);

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
}

function setOpacityInput(e: Event, rowIndex: number): void {
  const input = e.currentTarget as HTMLInputElement;

  const { isNaN } = Number;
  const formattedPercentageValue: string = isNaN(input.valueAsNumber)
    ? null
    : `${input.valueAsNumber}%`;
  const min: number = Number(getAttributeFrom("min", input));
  const max: number = Number(getAttributeFrom("max", input));

  clampInputValue(input, min, max);
  setStopColorPropertyById(rowIndex, "opacity", formattedPercentageValue);
}

function setOffsetInput(e: Event, rowIndex: number): void {
  const input = e.currentTarget as HTMLInputElement;

  const { isNaN } = Number;
  const formattedPercentageValue: string = isNaN(input.valueAsNumber)
    ? null
    : `${input.valueAsNumber}%`;

  setStopColorPropertyById(rowIndex, "offset", formattedPercentageValue);
}
