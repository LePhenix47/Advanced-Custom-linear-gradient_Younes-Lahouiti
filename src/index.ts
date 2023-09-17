import "@components/index.components";
import {
  addNewRowEntry,
  setTableRowsByDelegation,
} from "@utils/event-listeners/table-event-listeners";
import { log } from "@utils/helpers/console.helpers";
import {
  getClone,
  selectFirstByClass,
  selectQuery,
  setStyleProperty,
} from "@utils/helpers/dom.helpers";

import { handleContainerDraggingElementDragOver } from "@utils/event-listeners/drag-n-drop-listeners";

const addButton = selectFirstByClass<HTMLButtonElement>(
  "menu__add-color-button"
);

addButton.addEventListener("click", addNewRowEntry);

const tableBody =
  selectFirstByClass<HTMLTableSectionElement>("menu__table-body");

tableBody.addEventListener("click", setTableRowsByDelegation);
tableBody.addEventListener("dragover", handleContainerDraggingElementDragOver);
