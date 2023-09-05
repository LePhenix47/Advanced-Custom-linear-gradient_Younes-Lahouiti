import "@components/index.components";
import { log } from "@utils/helpers/console.helpers";
import { getClone, selectQuery } from "@utils/helpers/dom.helpers";

function testTableScroll() {
  const firstTableRow = selectQuery<HTMLTableRowElement>(
    ".menu__table-row:last-child"
  );

  const tbody = selectQuery<HTMLTableSectionElement>("tbody");

  for (let i = 0; i < 10; i++) {
    const clonedRow = getClone<HTMLTableRowElement>(firstTableRow);
    tbody.appendChild(clonedRow);
  }
}
testTableScroll();

const svgGradient = selectQuery<SVGElement>("svg");
