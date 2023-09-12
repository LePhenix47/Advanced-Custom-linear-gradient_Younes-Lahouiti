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
}

export default SVGGradientBase;
