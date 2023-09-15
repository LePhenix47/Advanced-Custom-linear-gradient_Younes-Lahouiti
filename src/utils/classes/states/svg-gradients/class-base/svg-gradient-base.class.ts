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
}

export default SVGGradientBase;
