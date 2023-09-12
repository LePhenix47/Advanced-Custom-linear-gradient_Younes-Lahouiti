import SVGGradient, {
  SVGCoordsFromRadian,
  SVGGradientTransformObject,
  SVGGradientTransformString,
  SVGGradientUnits,
  SVGLinearGradientColorStop,
  SVGRadialGradientAttributes,
  SVGSpreadMethods,
} from "../index-svg.class";

class SVGRadialGradient extends SVGGradient {
  /*
SVG Radial gradient formal syntax:

[ORIENTATION IN RADIANS] = [ORIENTATION IN DEGREES] × π ÷ 180

    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100dvh">
      <defs>
        <radialGradient id="svg-radial-gradient" cx=[CENTER X] cy=[CENTER X] r=[CIRCLE RADIUS] fr=[FOCAL RADIUS] fx=[FOCAL POINT X] fy=[FOCAL POINT Y]>
          <stop offset=[OFFSET1]% style="stop-color: #[COLOR1]; stop-opacity: [OPACITY1]%" />
          <stop offset=[OFFSET2]% style="stop-color: #[COLOR2]; stop-opacity: [OPACITY2]%" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#svg-radial-gradient)" />
    </svg>

  */
  // Properties specific to radial gradients with their default values as strings
  radialGradientAttributes: SVGRadialGradientAttributes;

  spreadMethod: SVGSpreadMethods;
  stopColors: SVGLinearGradientColorStop[];
  gradientTransform: SVGGradientTransformString;
  gradientUnits: SVGGradientUnits;
  IDENTITY_TRANSFORM: SVGGradientTransformString;

  constructor() {
    super();

    this.spreadMethod = "pad";

    this.IDENTITY_TRANSFORM = "rotate(0)";

    this.gradientTransform = this.IDENTITY_TRANSFORM; // Need to add a method to set this value

    this.gradientUnits = "objectBoundingBox"; // Need to add a method to set this value too

    this.radialGradientAttributes = {
      centerX: "50%",
      centerY: "50%",
      radius: "50%",
      focalRadius: "0%",
      focalX: "50%",
      focalY: "50%",
    };

    this.stopColors = [];
  }

  // Set the center point of the radial gradient
  setCenter(cx: string, cy: string): void {
    // Validate and set the center point
    this.radialGradientAttributes.centerX = cx;
    this.radialGradientAttributes.centerY = cy;
  }

  // Set the radius of the radial gradient
  setRadius(r: string): void {
    // Validate and set the radius
    this.radialGradientAttributes.radius = r;
  }

  // Set the fr property
  setFocalRadius(fr: string): void {
    // Validate and set the focal radius
    this.radialGradientAttributes.focalRadius = fr;
  }

  // Set the focal point of the radial gradient
  setFocalPoint(fx: string, fy: string): void {
    // Validate and set the focal point
    this.radialGradientAttributes.focalX = fx;
    this.radialGradientAttributes.focalY = fy;
  }

  /**
   * Add a stop color to the linear gradient.
   * @param {SVGLinearGradientColorStop} stopColor - The stop color to add.
   *
   * @throws {TypeError} If the stopColor object is missing required properties.
   *
   * @returns {void}
   *
   */
  addStopColor(stopColor: SVGLinearGradientColorStop): void {
    // The offset is a % which can be signed, can also be null if we don't want an offset
    // The color opacity is clamped between 0 & 100
    const properties: string[] = ["id", "color", "offset", "opacity"];
    for (const property of properties) {
      const doesNotHaveProperty: boolean = !stopColor.hasOwnProperty(property);
      if (doesNotHaveProperty) {
        throw new TypeError(
          `Invalid stop color for the linear gradient, ${property} does not exist on the passed object`
        );
      }
    }

    this.stopColors.push(stopColor);

    this.sortStopColorsArrayById();
  }

  /**
   * Sorts the stop colors array by their `id` property in ascending order.
   *
   * @private
   */
  private sortStopColorsArrayById() {
    this.stopColors.sort((obj1, obj2) => {
      return obj1.id - obj2.id;
    });
  }

  /**
   * Sets the spreading method for the SVG linear gradient
   * @param {SVGSpreadMethods} methodValue - Can be `"pad"`, `"reflect"` or `"repeat"`
   * @returns {void}
   */
  setSpreadMethod(methodValue: SVGSpreadMethods): void {
    this.spreadMethod = methodValue;
  }

  /**
   * Set the gradient transform using an object with transform functions.
   *
   * @param {SVGGradientTransformObject} transform - The object with gradient transform functions.
   *
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
    ) as SVGGradientTransformString; // Remove trailing space
  }

  /**
   * Generate the SVG linear gradient string based on the set parameters.
   * @returns {string} - The SVG linear gradient string.
   */
  generateSvgGradient(): string {
    const amountOfStopColors: number = this.stopColors.length;

    // Check if there are not enough stop colors to create a gradient
    if (amountOfStopColors < 2) {
      return "none";
    }

    let colorStops: string = "";

    for (let i = 0; i < amountOfStopColors; i++) {
      const stopColor: SVGLinearGradientColorStop = this.stopColors[i];
      const { offset, color, opacity, id } = stopColor;

      let normalizedOffset: string = offset;
      const colorHasNoOffset: boolean = offset === null;
      if (colorHasNoOffset) {
        console.log(i / (amountOfStopColors - 1));
        normalizedOffset = `${(i / (amountOfStopColors - 1)) * 100}%`;
      }

      colorStops += /* html */ `
      <stop offset="${normalizedOffset}" style="stop-color: ${color}; stop-opacity: ${opacity}" data-stop-id="${id}" />
    `;
    }

    const { centerX, centerY, radius, focalRadius, focalX, focalY } =
      this.radialGradientAttributes;

    const radialGradient: string = /* html */ `
    <radialGradient 
      id="svg-radial-gradient" 

      cx="${centerX}" 
      cy="${centerY}" 
      r="${radius}"
      fr="${focalRadius}" 
      fx="${focalX}" 
      fy="${focalY}"

      spreadMethod="${this.spreadMethod}"

      gradientTransform="${this.gradientTransform}"
      gradientUnits="${this.gradientUnits}"
    >
      ${colorStops}
    </radialGradient>
  `;

    const svg: string = /* html */ `
<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <defs>
    ${radialGradient}
  </defs>
  <rect width="100%" height="100%" fill="url(#svg-radial-gradient)" />
</svg>
`;

    return svg;
  }
}

export default SVGRadialGradient;

// Create an instance of SVGRadialGradient
const radialGradient = SVGGradient.create("radial") as SVGRadialGradient;

// Set attributes for the radial gradient
radialGradient.setCenter("50%", "50%");
radialGradient.setRadius("50%");
radialGradient.setFocalRadius("0%");
radialGradient.setFocalPoint("50%", "50%");

// Add stop colors to the gradient
radialGradient.addStopColor({
  id: 1,
  color: "#FF0000",
  offset: "20%",
  opacity: "100%",
});

radialGradient.addStopColor({
  id: 2,
  color: "#00FF00",
  offset: "50%",
  opacity: "100%",
});

radialGradient.addStopColor({
  id: 3,
  color: "#0000FF",
  offset: "80%",
  opacity: "100%",
});

// Set other properties like spread method and gradient transform
radialGradient.setSpreadMethod("pad");
radialGradient.setGradientTransform({
  rotate: 45,
  scale: 1.5,
});

// Generate the SVG radial gradient string
const svgGradient = radialGradient.generateSvgGradient();

console.log(svgGradient); // This will print the SVG radial gradient string
