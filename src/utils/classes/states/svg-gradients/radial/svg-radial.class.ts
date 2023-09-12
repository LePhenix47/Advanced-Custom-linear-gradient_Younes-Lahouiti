import SVGGradientBase from "../class-base/svg-gradient-base.class";
import SVGGradient, {
  SVGCoordsFromRadian,
  SVGGradientTransformObject,
  SVGGradientTransformString,
  SVGGradientUnits,
  SVGGradientColorStop,
  SVGRadialGradientAttributes,
  SVGSpreadMethods,
} from "../index-svg.class";

class SVGRadialGradient extends SVGGradientBase {
  /*
SVG Radial gradient formal syntax:

[ORIENTATION IN RADIANS] = [ORIENTATION IN DEGREES] × π ÷ 180

    <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 100 100" width="100%" height="100dvh">
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

  constructor() {
    super();

    this.radialGradientAttributes = {
      centerX: "50%",
      centerY: "50%",
      radius: "50%",
      focalRadius: "0%",
      focalX: "50%",
      focalY: "50%",
    };
  }

  /**
   * Sets the center point of the radial gradient.
   * @param {string} cx - The x-coordinate of the center.
   * @param {string} cy - The y-coordinate of the center.
   */
  setCenter(cx: string, cy: string): void {
    // Validate and set the center point
    this.radialGradientAttributes.centerX = cx;
    this.radialGradientAttributes.centerY = cy;
  }

  setRadius(r: string): void {
    // Validate and set the radius
    this.radialGradientAttributes.radius = r;
  }

  setFocalRadius(fr: string): void {
    // Validate and set the focal radius
    this.radialGradientAttributes.focalRadius = fr;
  }

  setFocalPoint(fx: string, fy: string): void {
    // Validate and set the focal point
    this.radialGradientAttributes.focalX = fx;
    this.radialGradientAttributes.focalY = fy;
  }

  addStopColor(stopColor: SVGGradientColorStop): void {
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

  generateSvgGradient(): string {
    const amountOfStopColors: number = this.stopColors.length;

    // Check if there are not enough stop colors to create a gradient
    if (amountOfStopColors < 2) {
      return "none";
    }

    let colorStops: string = "";

    for (let i = 0; i < amountOfStopColors; i++) {
      const stopColor: SVGGradientColorStop = this.stopColors[i];
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
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none">
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
