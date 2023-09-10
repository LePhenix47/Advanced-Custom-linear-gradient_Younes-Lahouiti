import CSSGradient from "../index-css.class";

/**
 * Class for CSS Radial Gradient
 * @extends CSSGradient
 */
class CSSRadialGradient extends CSSGradient {
  shape: "circle" | "ellipse";
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

export default CSSRadialGradient;
