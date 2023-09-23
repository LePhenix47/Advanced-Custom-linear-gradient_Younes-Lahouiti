import {
  GradientLanguage,
  GradientType,
} from "@utils/classes/states/index-gradients.class";
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
import { gradientInfos } from "@utils/variables/global-states/gradient-infos";
function setElementsToShow(
  arrayOfElements: HTMLElement[],
  classToShow: string,
  classToHideElement: string = "hide"
) {
  for (const element of arrayOfElements) {
    const languageClass: string = getClassListValues(element)[0].split("--")[1];

    const needsToBeHidden: boolean = classToShow !== languageClass;
    if (needsToBeHidden) {
      addClass(element, classToHideElement);
    } else {
      removeClass(element, classToHideElement);
    }
  }
}
export function switchLanguage(e: Event) {
  const selectElement = e.currentTarget as HTMLSelectElement;

  const currentLanguage = selectElement.value;
  gradientInfos.language = currentLanguage as GradientLanguage;

  const gradientTypesContainer = selectFirstByClass<HTMLDivElement>(
    "menu__gradient-types--inputs"
  );

  const gradientTypesElements: HTMLDivElement[] = getChildren(
    gradientTypesContainer
  );

  const optionsElements = selectQueryAll<HTMLDivElement>(
    ".menu__options>:not(h3)"
  );

  setElementsToShow(gradientTypesElements, gradientInfos.language);
  setElementsToShow(optionsElements, gradientInfos.language);
}

export function switchGradientTypes(e: Event) {
  const radioInput = e.currentTarget as HTMLInputElement;

  const [gradientType, gradientLanguage] = radioInput.id.split("-");
  gradientInfos.type = gradientType as GradientType;

  const languageSpecificGradientOptions = selectQueryAll<HTMLDivElement>(
    `.menu__options--${gradientInfos.language}>*:not(.menu__options-${gradientInfos.language}--common)`
  );

  setElementsToShow(languageSpecificGradientOptions, gradientInfos.type);

  log(languageSpecificGradientOptions);
}
