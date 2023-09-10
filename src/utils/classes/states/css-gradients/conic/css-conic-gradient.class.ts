import CSSGradient from "../index-css.class";

/**
 * Class for CSS Conic Gradient
 * @extends CSSGradient
 */
class CSSConicGradient extends CSSGradient {
  position: { start: string; end: string };
  isRepeating: boolean;
  constructor() {
    super();
  }

  centerCoordinates(coordinates: { start: string; end: string }) {
    this.position = coordinates;
  }

  /**
   * Set whether the linear gradient should repeat.
   * @param {boolean} repeatValue - If true, the gradient will repeat.
   * @returns {void}
   */
  setRepeating(repeatValue: boolean): void {
    this.isRepeating = repeatValue;
  }
}

export default CSSConicGradient;
