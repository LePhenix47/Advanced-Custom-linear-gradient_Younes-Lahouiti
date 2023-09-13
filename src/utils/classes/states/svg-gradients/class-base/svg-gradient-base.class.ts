import {
  SVGGradientTransformObject,
  SVGGradientTransformString,
  SVGGradientUnits,
  SVGGradientColorStop,
  SVGSpreadMethods,
} from "../index-svg.class";

class SVGGradientBase {
  spreadMethod: SVGSpreadMethods;

  stopColors: SVGGradientColorStop[];

  gradientTransform: SVGGradientTransformString;
  IDENTITY_TRANSFORM: SVGGradientTransformString;
  gradientUnits: SVGGradientUnits;

  constructor() {
    this.spreadMethod = "pad";

    this.IDENTITY_TRANSFORM = "rotate(0)";

    this.gradientTransform = this.IDENTITY_TRANSFORM;

    this.gradientUnits = "objectBoundingBox";

    this.stopColors = [];
  }

  setSpreadMethod(methodValue: SVGSpreadMethods): void {
    this.spreadMethod = methodValue;
  }

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

  protected sortStopColorsArrayById() {
    this.stopColors.sort((obj1, obj2) => {
      return obj1.id - obj2.id;
    });
  }

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
    this.stopColors.splice(indexToReplace, 1, objectToReplace);

    const objectToBeReplacedBy: SVGGradientColorStop =
      this.stopColors[indexToBeReplacedBy];
    this.stopColors.splice(indexToBeReplacedBy, 1, objectToBeReplacedBy);
  }
}

export default SVGGradientBase;
