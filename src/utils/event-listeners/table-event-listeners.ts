import {
  getAncestor,
  getClassListValues,
  getClone,
  getContentOfTemplate,
  removeChildInParent,
  selectById,
  selectFirstByClass,
  selectQuery,
  selectQueryAll,
} from "@utils/helpers/dom.helpers";
import { formatStringCase } from "@utils/helpers/string.helpers";

// Initialized with the starting index

/**
 * Gets the number of rows in a table body.
 *
 * @returns {number} - The count of rows in the table body.
 */
function getAmountOfRowsInTbody(): number {
  return selectQueryAll<HTMLTableRowElement>("tbody>tr").length + 1;
}

/**
 * Updates the index in the 2nd cell of each row in a table body.
 *
 * @param {HTMLTableSectionElement} tbody - The table body element containing the rows.
 * @returns {void}
 */
function changeRowsIndexes(tbody: HTMLTableSectionElement): void {
  const tableRowsArray = selectQueryAll<HTMLTableRowElement>("tr", tbody);

  for (let i = 0; i < tableRowsArray.length; i++) {
    const row: HTMLTableRowElement = tableRowsArray[i];

    const cells = selectQueryAll<HTMLTableCellElement>("td", row);

    const paragraph = selectQuery<HTMLParagraphElement>("p", cells[1]);

    paragraph.textContent = `${i + 1}.`;
  }

  console.log(tableRowsArray);
}

/**
 * Callback that adds a new color row to the table, updating the index in the 2nd cell.
 *
 * @returns {void}
 */
export function addNewColor(): void {
  const tableBody =
    selectFirstByClass<HTMLTableSectionElement>("menu__table-body");

  const defaultRowTemplate = selectById<HTMLTemplateElement>(
    "template__linear-gradient"
  );

  const clonedRowDocumentFragment: DocumentFragment =
    getContentOfTemplate(defaultRowTemplate);

  const row = selectQuery<HTMLTableRowElement>("tr", clonedRowDocumentFragment);

  // Modify the index in the 2nd cell of the row
  const cellIndex = selectFirstByClass<HTMLParagraphElement>(
    "menu__table-cell-index",
    row
  );

  const currentIndex: number = getAmountOfRowsInTbody();
  cellIndex.textContent = `${currentIndex}.`; // Update the index in the cell

  tableBody.appendChild(row);
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

  console.log(clickedElement);
  console.log(elementClasses);

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
    changeRowsIndexes(tbody);
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
    changeRowsIndexes(tbody);
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
  console.log("deleteRow", rowElement, "tbody", tbody);

  removeChildInParent(tbody, rowElement);

  changeRowsIndexes(tbody);
}
