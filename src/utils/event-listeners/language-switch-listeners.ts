import { log } from "@utils/helpers/console.helpers";
import {
  addClass,
  getChildren,
  getClassListValues,
  removeClass,
  selectFirstByClass,
  selectQuery,
  selectQueryAll,
} from "@utils/helpers/dom.helpers";

export function switchLanguage(e: Event) {
  const selectElement = e.target as HTMLSelectElement;

  const currentLanguage: string = selectElement.value;

  const gradientTypesContainer = selectFirstByClass<HTMLDivElement>(
    "menu__gradient-types--inputs"
  );

  const gradientTypesElements: HTMLDivElement[] = getChildren(
    gradientTypesContainer
  );

  log(gradientTypesElements);

  for (const gradientTypeElement of gradientTypesElements) {
    let gradientClass: string = getClassListValues(gradientTypeElement)[0];
    gradientClass = gradientClass.split("--")[1];

    const needsToBeHidden: boolean = currentLanguage !== gradientClass;
    if (needsToBeHidden) {
      addClass(gradientTypeElement, "hide");
    } else {
      removeClass(gradientTypeElement, "hide");
    }
  }

  const optionsElements = selectQueryAll<HTMLDivElement>(
    ".menu__options>:not(h3)"
  );

  for (const option of optionsElements) {
    let optionClass: string = getClassListValues(option)[0];
    optionClass = optionClass.split("--")[1];

    const needsToBeHidden: boolean = currentLanguage !== optionClass;
    if (needsToBeHidden) {
      addClass(option, "hide");
    } else {
      removeClass(option, "hide");
    }
  }
}

export function switchCssGradientType() {}
