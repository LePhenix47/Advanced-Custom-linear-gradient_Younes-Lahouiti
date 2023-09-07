import "@components/index.components";
import { log } from "@utils/helpers/console.helpers";
import { getClone, selectQuery } from "@utils/helpers/dom.helpers";
import { radiansToDegrees } from "@utils/helpers/math.helpers";
import { roundToFloat } from "@utils/helpers/number.helpers";

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
// testTableScroll();

function calculateAngle(initialX, initialY, mouseX, mouseY) {
  const deltaY: number = mouseY - initialY;
  const deltaX: number = mouseX - initialX;

  const angleInRadians: number = Math.atan2(deltaY, deltaX);

  let angleInDegrees: number = -1 * radiansToDegrees(angleInRadians);
  angleInDegrees = roundToFloat(angleInDegrees, 0) + 90;

  // Normalize angle to be in the range of 0 to 360 degrees
  const hasNegativeDegreesValue: boolean = angleInDegrees < 0;
  if (hasNegativeDegreesValue) {
    angleInDegrees += 360;
  }

  return angleInDegrees;
}

function testAnglePickerMouseMove() {
  const anglePickerContainer =
    selectQuery<HTMLDivElement>(".menu__orientation");

  const btn = selectQuery<HTMLButtonElement>(".menu__angle-picker--rotator");

  const orientationOutput = selectQuery<HTMLOutputElement>(
    ".menu__orientation-output"
  );

  anglePickerContainer.addEventListener("mousemove", (e: MouseEvent) => {
    const centerDot = selectQuery<HTMLDivElement>(
      ".menu__angle-picker--center-dot"
    );
    const circleBox = centerDot.getBoundingClientRect();

    const mouseX: number = e.x - circleBox.x;
    const mouseY: number = circleBox.y - e.y; // The inversion is needed here because it uses the SVG coords system

    const angle: number = calculateAngle(0, 1, mouseX, mouseY);

    // console.log(`${angle}deg`);

    btn.style.setProperty("--_rotation", `${angle}deg`);
    orientationOutput.textContent = `${angle}°`;
  });
}

testAnglePickerMouseMove();

const svgGradient = selectQuery<SVGElement>("svg");
