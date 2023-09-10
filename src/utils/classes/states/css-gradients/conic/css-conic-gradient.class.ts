import CSSGradient from "../index-css.class";

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

export default CSSConicGradient;
