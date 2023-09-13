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
import { radiansToDegrees } from "@utils/helpers/math.helpers";
import { roundToFloat } from "@utils/helpers/number.helpers";
import CSSGradient from "@utils/classes/states/css-gradients/index-css.class";
import CSSLinearGradient from "@utils/classes/states/css-gradients/linear/css-linear.class";
import CSSRadialGradient from "@utils/classes/states/css-gradients/radial/css-radial.class";

export function calculateAngle(mouseX, mouseY) {
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

export function testAnglePickerMouseMove() {
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
    const circleBox: DOMRect = centerDot.getBoundingClientRect();

    const mouseX: number = e.x - circleBox.x;
    const mouseY: number = circleBox.y - e.y; // The inversion is needed here because JS uses the SVG coords system

    const angle: number = calculateAngle(mouseX, mouseY);

    // console.log(`${angle}deg`);

    setStyleProperty("--_rotation", `${angle}deg`, btn);
    orientationOutput.textContent = `${angle}°`;
  });
}

testAnglePickerMouseMove();

//
//
//
//
//

const addButton = selectFirstByClass<HTMLButtonElement>(
  "menu__add-color-button"
);

addButton.addEventListener("click", addNewRowEntry);

const tableBody =
  selectFirstByClass<HTMLTableSectionElement>("menu__table-body");

tableBody.addEventListener("click", setTableRowsByDelegation);
