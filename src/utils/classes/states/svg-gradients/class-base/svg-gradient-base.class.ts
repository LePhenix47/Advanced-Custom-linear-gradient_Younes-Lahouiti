import {
  camelToPascalCase,
  formatStyleAttribute,
  kebabToCamelCase,
} from "@utils/helpers/string.helpers";

import {
  SVGGradientTransformObject,
  SVGGradientTransformString,
  SVGGradientUnits,
  SVGGradientColorStop,
  SVGSpreadMethods,
} from "../index-svg.class";

class SVGGradientBase {
  /**
   * The spread method for the gradient.
   * @type {SVGSpreadMethods}
   */
  spreadMethod: SVGSpreadMethods;

  /**
   * An array of color stops for the gradient.
   * @type {SVGGradientColorStop[]}
   */
  stopColors: SVGGradientColorStop[];

  /**
   * The transform applied to the gradient as an SVG transform string.
   * @type {SVGGradientTransformString}
   */
  gradientTransform: SVGGradientTransformString;

  /**
   * The identity transform default value as a string.
   * @type {SVGGradientTransformString}
   */
  IDENTITY_TRANSFORM: SVGGradientTransformString;

  /**
   * The units for the gradient coordinates.
   * @type {SVGGradientUnits}
   */
  gradientUnits: SVGGradientUnits;

  constructor() {
    this.spreadMethod = "pad";

    this.IDENTITY_TRANSFORM = "rotate(0)";

    this.gradientTransform = this.IDENTITY_TRANSFORM;

    this.gradientUnits = "objectBoundingBox";

    this.stopColors = [];
  }

  /**
   * Set the spread method for the gradient.
   * @param {SVGSpreadMethods} methodValue - The spread method to set.
   * @returns {void}
   */
  setSpreadMethod(methodValue: SVGSpreadMethods): void {
    this.spreadMethod = methodValue;
  }

  /**
   * Sets the gradient units for the radial gradient.
   * @param {("objectBoundingBox"|"userSpaceOnUse")} units - The units for the gradient.
   * @throws {TypeError} If an invalid units value is provided.
   */
  setGradientUnits(units: "objectBoundingBox" | "userSpaceOnUse"): void {
    const validUnits: string[] = ["objectBoundingBox", "userSpaceOnUse"];

    const hasInvalidArgument: boolean = !validUnits.includes(units);
    if (hasInvalidArgument) {
      throw new TypeError(
        `Invalid gradient units, expected one of [${validUnits.join(
          ", "
        )}] but got ${units}`
      );
    }

    this.gradientUnits = units;
  }

  /**
   * Set the gradient transform using an object of transform functions.
   *
   * @param {SVGGradientTransformObject} transform - The transform functions to apply.
   * @returns {void}
   */
  setGradientTransform(transform: SVGGradientTransformObject): void {
    const appliedTransforms: Set<string> = new Set(this.gradientTransform);

    let transformString: SVGGradientTransformString[] = [
      this.IDENTITY_TRANSFORM,
    ];
    // Iterate through the transform object and add unique transform functions
    for (const [key, value] of Object.entries(transform)) {
      const transformFunction =
        `${key}(${value})` as SVGGradientTransformString;

      // Check if this transform has not been applied before
      const hasNotAppliedTransform: boolean =
        !appliedTransforms.has(transformFunction);
      if (hasNotAppliedTransform) {
        transformString.push(transformFunction);
        appliedTransforms.add(transformFunction);
      }
    }

    this.gradientTransform = transformString.join(
      " "
    ) as SVGGradientTransformString;
  }

  /**
   * Sorts the color stops in the array by their `id` property.
   * @protected
   */
  protected sortStopColorsArrayById() {
    this.stopColors.sort((obj1, obj2) => {
      return obj1.id - obj2.id;
    });
  }

  /**
   * Changes the order of color stops by updating their `id` properties.
   *
   * @param {number} oldId - The current `id` of the color stop to be moved.
   * @param {number} newId - The new `id` to assign to the color stop.
   */
  changeColorOrderById(oldId: number, newId: number): void {
    const indexToReplace: number = this.stopColors.findIndex((stopCol) => {
      return stopCol.id === oldId;
    });

    const indexToBeReplacedBy: number = this.stopColors.findIndex((stopCol) => {
      return stopCol.id === newId;
    });

    const hasInvalidArguments: boolean =
      indexToReplace === -1 || indexToBeReplacedBy === -1;

    if (hasInvalidArguments) {
      throw new RangeError(
        `Invalid id arguments, expected both to ids to return their referring objects but couldn't find them, with oldId (${oldId}): ${
          indexToBeReplacedBy !== 1
            ? "found old object"
            : "couldn't find old object"
        } and with newId (${newId}): ${
          indexToReplace !== 1 ? "found new object" : "couldn't find new object"
        }`
      );
    }

    const objectToReplace: SVGGradientColorStop =
      this.stopColors[indexToReplace];
    objectToReplace.id = newId;
    this.stopColors.splice(indexToReplace, 1, objectToReplace);

    const objectToBeReplacedBy: SVGGradientColorStop =
      this.stopColors[indexToBeReplacedBy];
    objectToBeReplacedBy.id = oldId;
    this.stopColors.splice(indexToBeReplacedBy, 1, objectToBeReplacedBy);
  }

  static toReactNativeSvg(htmlSvg: string): string {
    const backSpaceRegex: RegExp = /[\n]+/g;
    const formattedSvgString: string = htmlSvg.replaceAll(backSpaceRegex, "");

    const htmlTagRegex: RegExp = /<([^>]+)>/g;
    const arrayOfHtmlSvg: string[] = formattedSvgString
      .split(htmlTagRegex)
      .filter((string) => {
        return !!string.trim();
      });

    for (let i = 0; i < arrayOfHtmlSvg.length; i++) {
      /*
    DO NOT REMOVE THIS COMMENT!!!

    Example: ['svg width="100" height="100" stroke-width="2"', 'circle cx="50" cy="50" r="40" fill="red" /', '/svg']

    To do:
    - Split each svg partial by their whitespace 
    - The first item (ex: the tag 'svg') will need to have the first letter capitalized (can use my own helper function "formatStringCase")
    - The other items (ex: the attributes 'width="100" height="100" stroke-width="2"') will need to change their string case from kebab-case to camelCase
    */
      const htmlSvgPartial: string = arrayOfHtmlSvg[i];

      // Split each SVG partial by whitespace
      const partialItems: string[] = htmlSvgPartial.split(
        /\s+(?=(?:(?:[^"]*"){2})*[^"]*$)/
      );

      // Capitalize the first letter of the tag
      partialItems[0] = camelToPascalCase(partialItems[0]);

      // Capitalize the first letter of the tag
      const isClosingTag: boolean = partialItems[0].startsWith("/");
      if (isClosingTag) {
        /*
      We have to replace the characters after the forward slash in TitleCase
      */
        const tagName: string = partialItems[0].substring(1); // Remove the '/' from the beginning
        const formattedTagName: string = camelToPascalCase(tagName);
        partialItems[0] = `/${formattedTagName}`;
      } else {
        for (let j = 1; j < partialItems.length; j++) {
          const attribute: string[] = partialItems[j].split("=");

          const [key, value]: string[] = attribute;
          const camelCaseKey: string = kebabToCamelCase(key);

          const arrayOfNumberProperties: string[] = [
            "x1",
            "y1",
            "x2",
            "y2",
            "cx",
            "cy",
            "r",
            "fr",
            "fx",
            "fy",
          ];

          const areOrientationCoords: boolean =
            arrayOfNumberProperties.includes(key);
          // Check if the attribute is a style attribute
          const isStyleAttribute: boolean = key === "style";
          if (isStyleAttribute) {
            // Handle the style attribute formatting for React Native SVG properties
            const styleObject: string = formatStyleAttribute(value);
            // Replace the original style attribute with the formatted one
            partialItems[j] = `${camelCaseKey}={[${styleObject}]}`;
          } else {
            if (areOrientationCoords) {
              const formattedNumberValue: number = Number(
                value.replaceAll('"', "")
              );
              partialItems[j] = `${camelCaseKey}={${formattedNumberValue}}`;
            } else {
              partialItems[j] = `${camelCaseKey}=${value}`;
            }
          }
        }
      }

      // Join the items back into a string
      arrayOfHtmlSvg[i] = `<${partialItems.join(" ")}>`;
    }

    // Join the modified SVG partials back into a single string
    const reactNativeSvg: string = arrayOfHtmlSvg.join("\n");

    return reactNativeSvg;
  }
}

export default SVGGradientBase;
