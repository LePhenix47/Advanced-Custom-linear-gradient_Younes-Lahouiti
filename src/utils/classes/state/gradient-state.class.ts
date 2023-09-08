/**
 * Base class for CSS Gradients
 * @abstract
 */
class CSSGradient {
  /**
   * The type of gradient (linear, radial, or conic)
   * @type {string}
   */
  gradientType: string = "linear";

  /**
   * The orientation for linear gradients in degrees (e.g., "45deg")
   * @type {number}
   */
  orientation: number = 0;

  /**
   * The shape for radial gradients (e.g., "circle" or "ellipse")
   * @type {"circle" | "ellipse"}
   */
  shape: "circle" | "ellipse" = "circle";

  /**
   * The position for radial gradients (e.g., "at 50% 50%")
   * @type {string}
   */
  position: string = "";

  /**
   * The angle for conic gradients (e.g., "at 50% 50%, 45deg")
   * @type {string}
   */
  angle: string = "";

  /**
   * An array to store color stops
   * @type {Array}
   */
  colorStops: Array<any> = [];

  /**
   * Indicates whether the gradient is repeating
   * @type {boolean}
   */
  isRepeating: boolean = false;

  /**
   * Generate the CSS gradient string based on the set parameters
   * @returns {string} - The CSS gradient string
   */
  generateCSSGradient() {
    // Implement logic to generate the CSS gradient string based on parameters
    // You can use this.gradientType, this.orientation, this.shape, etc.
    // to construct the gradient string.
    // Be sure to handle the color stops and whether it's repeating.
  }
}

/**
 * Class for CSS Linear Gradient
 * @extends CSSGradient
 */
class CSSLinearGradient extends CSSGradient {
  constructor() {
    super();
  }

  /**
   * Set the orientation for linear gradients (e.g., "45deg")
   * @param {number} orientation - The orientation angle in degrees
   */
  setOrientation(orientation: number) {
    this.orientation = orientation;
  }
}

/**
 * Class for CSS Radial Gradient
 * @extends CSSGradient
 */
class CSSRadialGradient extends CSSGradient {
  constructor() {
    super();
  }
}

/**
 * Class for CSS Conic Gradient
 * @extends CSSGradient
 */
class CSSConicGradient extends CSSGradient {
  constructor() {
    super();
  }
}
