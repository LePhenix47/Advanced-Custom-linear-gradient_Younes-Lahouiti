/**
 * Base class for CSS Gradients
 * @abstract
 */
class CSSGradient {
  static gradientType: "linear" | "radial" | "conic" = "linear";
  /**
   * Factory method to create CSS gradient instances based on the type
   * @param {"linear" | "radial" | "conic"} gradientType - The type of gradient
   * @returns {CSSGradient} - An instance of the specific CSS gradient type
   */
  static create(gradientType) {
    switch (gradientType) {
      case "linear": {
        return new CSSLinearGradient();
      }
      case "radial": {
        return new CSSRadialGradient();
      }
      case "conic": {
        return new CSSConicGradient();
      }
      default:
        throw new Error(`Unsupported gradient type: ${gradientType}`);
    }
  }
}

/**
 * Class for CSS Linear Gradient
 * @extends CSSGradient
 */
class CSSLinearGradient extends CSSGradient {
  orientation: number;
  constructor() {
    super();

    this.orientation = 0;
  }

  // Add methods specific to linear gradients here
  setOrientation(orientation: number) {
    this.orientation = orientation;
  }
}

/**
 * Class for CSS Radial Gradient
 * @extends CSSGradient
 */
class CSSRadialGradient extends CSSGradient {
  shape: string;
  position: { start: string; end: string };
  constructor() {
    super();

    this.shape = "circle";
  }

  // Add methods specific to radial gradients here
  setShape(shape: "ellipse" | "circle") {
    this.shape = shape;
  }

  setPosition(position: { start: string; end: string }) {
    this.position = position;
  }
}

/**
 * Class for CSS Conic Gradient
 * @extends CSSGradient
 */
class CSSConicGradient extends CSSGradient {
  position: { start: string; end: string };
  constructor() {
    super();
  }

  centerCoordinates(coordinates: { start: string; end: string }) {
    this.position = coordinates;
  }
}

// Example usage:
const linearGradient1 = CSSGradient.create("linear") as CSSLinearGradient;
linearGradient1.setOrientation(270);
console.log(linearGradient1);

// const linearGradient = CSSGradient.create("linear") as CSSLinearGradient;
// linearGradient.isReapeating = false;
// linearGradient.setOrientation(270);
// linearGradient.addStopColor({color: "#ff0000", offset: null, opacity: "100%"});
// linearGradient.addStopColor({color: "#00ff00", offset: "25%", opacity: "50%"});
// linearGradient.addStopColor({color: "#0000ff", offset: "100%", opacity: "50%"});

// console.log(linearGradient.generateGradient())
// output: linear-gradient(270deg, #ff0000, #00ff0080 25%, #0000ff80 100%)
