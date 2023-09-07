import {
  getClone,
  getContentOfTemplate,
  selectById,
  selectFirstByClass,
  selectQuery,
} from "@utils/helpers/dom.helpers";

// Initialized with the starting index

let currentIndex = 2;
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
  const cellIndex = selectQuery<HTMLParagraphElement>(
    ".menu__table-cell-index",
    row
  );

  currentIndex++; // Increment the index
  cellIndex.textContent = `${currentIndex}.`; // Update the index in the cell

  tableBody.appendChild(row);
}

export function setTableRowsByDelegation(e: MouseEvent) {
  const clickedElement = e.target as unknown;

  console.log(clickedElement);
}
