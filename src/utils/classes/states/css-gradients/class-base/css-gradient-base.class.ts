import { CSSConicGradientColorStop } from "../conic/css-conic-gradient.class";
import { CSSLinearGradientColorStop } from "../linear/css-linear-gradient.class";
import { CSSRadialGradientColorStop } from "../radial/css-radial-gradient.class";

class CSSGradientBase {
  isRepeating: boolean;
  stopColors:
    | CSSLinearGradientColorStop[]
    | CSSRadialGradientColorStop[]
    | CSSConicGradientColorStop[];

  constructor() {
    this.isRepeating = false;

    this.stopColors = [];
  }

  /**
   * Set whether the gradient should repeat.
   * @param {boolean} repeatValue - If true, the gradient will repeat.
   * @returns {void}
   */
  setRepeating(repeatValue: boolean): void {
    this.isRepeating = repeatValue;
  }

  protected sortStopColorsArrayById(): void {
    this.stopColors.sort((obj1, obj2) => {
      return obj1.id - obj2.id;
    });
  }
}

export default CSSGradientBase;
