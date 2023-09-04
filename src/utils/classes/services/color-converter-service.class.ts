import { log } from "../../functions/helper-functions/console.functions";
import {
  decimalToHexadecimal,
  hexadecimalToDecimal,
} from "../../functions/helper-functions/number.functions";
import {
  sliceString,
  getSubtring,
} from "../../functions/helper-functions/string.functions";
import {
  HueSaturationLightness,
  HueSaturationValue,
  HueWhitenessBlackness,
  RedGreenBlue,
} from "../../variables/color-types.variables";

/**
 * Abstract class containing conversion methods for various color models.
 */
class AbstractConversionMethods {
  /**
   * Converts RGB color to hexadecimal format.
   * @param {RedGreenBlue} color - The RGB color object.
   * @returns {string} The color in hexadecimal format.
   */
  fromRgbToHex(color: RedGreenBlue): string {
    const { red, green, blue } = color;

    const hexadecimalRed: string = decimalToHexadecimal(red);
    const hexadecimalGreen: string = decimalToHexadecimal(green);
    const hexadecimalBlue: string = decimalToHexadecimal(blue);

    return `#${hexadecimalRed}${hexadecimalGreen}${hexadecimalBlue};`;
  }

  /**
   * Converts a color in hexadecimal format to RGB.
   * @param {string} color - The color in hexadecimal format.
   * @returns {RedGreenBlue} The RGB color object.
   */
  fromHexToRgb(color: string): RedGreenBlue {
    const colorArgumentIsInvalid: boolean =
      color?.length < 6 || color?.length > 7;
    if (colorArgumentIsInvalid) {
      console.error(
        `Error: Unexpected color argument length passed, was expecting a 6 or 7 characters long string but instead got ${color.length}`
      );
    }

    let hexColor: string = color;

    const hasHashTag: boolean = color.charAt(0) === "#";
    if (hasHashTag) {
      hexColor = sliceString(color, 1);
    }

    let redBase16: string = getSubtring(hexColor, 0, 2);
    let greeBase16: string = getSubtring(hexColor, 2, 4);
    let blueBase16: string = getSubtring(hexColor, 4, 6);

    let base16NumbersArray: any[] = [redBase16, greeBase16, blueBase16];

    for (let i = 0; i < base16NumbersArray.length; i++) {
      let colorBase16: string = base16NumbersArray[i];
      base16NumbersArray[i] = hexadecimalToDecimal(colorBase16);
    }

    const redBase10: number = Number(base16NumbersArray[0]);
    const greenBase10: number = Number(base16NumbersArray[1]);
    const blueBase10: number = Number(base16NumbersArray[2]);

    return { red: redBase10, green: greenBase10, blue: blueBase10 };
  }

  /**
   * Converts RGB color to HSL (Hue, Saturation, Lightness).
   * @param {RedGreenBlue} color - The RGB color object.
   * @returns {HueSaturationLightness} The HSL color object.
   */
  fromRgbToHsl(color: RedGreenBlue): HueSaturationLightness {
    const { red, green, blue } = color;

    const argumentsAreInvalid: boolean =
      !Number.isInteger(red) ||
      !Number.isInteger(green) ||
      !Number.isInteger(blue) ||
      red < 0 ||
      red > 255 ||
      green < 0 ||
      green > 255 ||
      blue < 0 ||
      blue > 255;
    if (argumentsAreInvalid) {
      console.error(
        `Invalid RGB color values. Expected integers between 0 and 255, but received: red=${red}, green=${green}, blue=${blue}`
      );
    }

    // Normalize RGB values
    const normalizedRed: number = red / 255;
    const normalizedGreen: number = green / 255;
    const normalizedBlue: number = blue / 255;

    // Find the maximum and minimum values of RGB
    const max: number = Math.max(
      normalizedRed,
      normalizedGreen,
      normalizedBlue
    );
    const min: number = Math.min(
      normalizedRed,
      normalizedGreen,
      normalizedBlue
    );

    const delta: number = max - min;
    // Calculate the lightness
    const lightness: number = (max + min) / 2;

    // Calculate the saturation
    let saturation: number;
    // Calculate the hue
    let hue: number;

    const isAchromatic: boolean = max === min;
    if (isAchromatic) {
      hue = 0; // achromatic (gray)
      saturation = 0;
    } else {
      saturation =
        lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
      switch (max) {
        case normalizedRed: {
          hue =
            ((normalizedGreen - normalizedBlue) / delta +
              (normalizedGreen < normalizedBlue ? 6 : 0)) /
            6;
          break;
        }

        case normalizedGreen: {
          hue = ((normalizedBlue - normalizedRed) / delta + 2) / 6;
          break;
        }

        case normalizedBlue: {
          hue = ((normalizedRed - normalizedGreen) / delta + 4) / 6;
          break;
        }
      }
    }

    // Round the values and multiply saturation and lightness by 100
    const roundedHue: number = Math.round(hue * 360);
    const roundedSaturation: number = Math.round(saturation * 100);
    const roundedLightness: number = Math.round(lightness * 100);

    // Return the HSL color value as a string
    return {
      hue: roundedHue % 360,
      saturation: roundedSaturation,
      lightness: roundedLightness,
    };
  }

  /**
   * Converts HSL (Hue, Saturation, Lightness) color to RGB.
   * @param {HueSaturationLightness} color - The HSL color object.
   * @returns {RedGreenBlue} The RGB color object.
   */
  fromHslToRgb(color: HueSaturationLightness): RedGreenBlue {
    const { hue, saturation, lightness } = color;

    const normalizedSaturation: number = saturation / 100;
    const normalizedLightness: number = lightness / 100;

    function calculateComponent(colorValue: number): number {
      // log({ normalizedSaturation, normalizedLightness });
      const colorComponent: number = (colorValue + hue / 30) % 12;
      const chroma: number =
        normalizedSaturation *
        Math.min(normalizedLightness, 1 - normalizedLightness);
      return (
        normalizedLightness -
        chroma *
          Math.max(-1, Math.min(colorComponent - 3, 9 - colorComponent, 1))
      );
    }

    return {
      red: Math.round(calculateComponent(0) * 255),
      green: Math.round(calculateComponent(8) * 255),
      blue: Math.round(calculateComponent(4) * 255),
    };
  }

  /**
   * Converts RGB color to HWB (Hue, Whiteness, Blackness).
   * @param {RedGreenBlue} color - The RGB color object.
   * @returns {HueWhitenessBlackness} The HWB color object.
   */
  fromRgbToHwb(color: RedGreenBlue): HueWhitenessBlackness {
    const { red, green, blue } = color;

    const normalizedRed: number = red / 255;
    const normalizedGreen: number = green / 255;
    const normalizedBlue: number = blue / 255;

    const { hue } = this.fromRgbToHsl(color);

    const whiteness: number = Math.min(
      normalizedRed,
      normalizedGreen,
      normalizedBlue
    );
    const blackness: number =
      1 - Math.max(normalizedRed, normalizedGreen, normalizedBlue);

    return {
      hue: hue % 360,
      whiteness: Math.round(whiteness * 100),
      blackness: Math.round(blackness * 100),
    };
  }

  /**
   * Converts HWB (Hue, Whiteness, Blackness) color to RGB.
   * @param {HueWhitenessBlackness} color - The HWB color object.
   * @returns {RedGreenBlue} The RGB color object.
   */
  fromHwbToRgb(color: HueWhitenessBlackness): RedGreenBlue {
    const { hue, whiteness, blackness } = color;

    const normalizedWhiteness: number = whiteness / 100;
    const normalizedBlackness: number = blackness / 100;

    const isGrey: boolean = normalizedWhiteness + normalizedBlackness >= 1;
    if (isGrey) {
      const greyColor: number =
        normalizedWhiteness / (normalizedWhiteness + normalizedBlackness);

      return {
        red: Math.round(greyColor * 100),
        green: Math.round(greyColor * 100),
        blue: Math.round(greyColor * 100),
      };
    }
    const { red, green, blue } = this.fromHslToRgb({
      hue,
      saturation: 100,
      lightness: 50,
    });

    const normalizedRed = red / 255;
    const normalizedGreen = green / 255;
    const normalizedBlue = blue / 255;

    const calculatedRed: number =
      normalizedRed * (1 - normalizedWhiteness - normalizedBlackness) +
      normalizedWhiteness;
    const calculatedGreen: number =
      normalizedGreen * (1 - normalizedWhiteness - normalizedBlackness) +
      normalizedWhiteness;
    const calculatedBlue: number =
      normalizedBlue * (1 - normalizedWhiteness - normalizedBlackness) +
      normalizedWhiteness;

    return {
      red: Math.round(calculatedRed * 255),
      green: Math.round(calculatedGreen * 255),
      blue: Math.round(calculatedBlue * 255),
    };
  }

  /**
   * Converts RGB color to HSV (Hue, Saturation, Value).
   * @param {RedGreenBlue} color - The RGB color object.
   * @returns {HueSaturationValue} The HSV color object.
   */
  fromRgbToHsv(color: RedGreenBlue): HueSaturationValue {
    const { red, green, blue } = color;

    const min: number = Math.min(red, green, blue);
    const max: number = Math.max(red, green, blue);

    const { hue } = this.fromRgbToHsl(color);

    const normalizedSaturation: number = max !== 0 ? 1 - min / max : 0;
    const normalizedValue: number = max / 255;

    return {
      hue: hue % 360,
      saturation: Math.round(normalizedSaturation * 100),
      value: Math.round(normalizedValue * 100),
    };
  }

  /**
   * Converts HSV (Hue, Saturation, Value) color to RGB.
   * @param {HueSaturationValue} color - The HSV color object.
   * @returns {RedGreenBlue} The RGB color object.
   */
  fromHsvToRgb(color: HueSaturationValue): RedGreenBlue {
    const { hue, saturation, value } = color;

    // Normalize saturation and value to the range of 0-1
    const normalizedSaturation = saturation / 100;
    const normalizedValue = value / 100;

    // Calculate intermediate values
    const chroma: number = normalizedValue * normalizedSaturation;
    const hueSegment: number = hue / 60;
    const intermediate: number = chroma * (1 - Math.abs((hueSegment % 2) - 1));
    const lightnessAdjustment: number = normalizedValue - chroma;

    let normalizedRed: number;
    let normalizedGreen: number;
    let normalizedBlue: number;

    // Determine the RGB values based on the hue segment
    if (hueSegment >= 0 && hueSegment < 1) {
      normalizedRed = chroma;
      normalizedGreen = intermediate;
      normalizedBlue = 0;
    } else if (hueSegment >= 1 && hueSegment < 2) {
      normalizedRed = intermediate;
      normalizedGreen = chroma;
      normalizedBlue = 0;
    } else if (hueSegment >= 2 && hueSegment < 3) {
      normalizedRed = 0;
      normalizedGreen = chroma;
      normalizedBlue = intermediate;
    } else if (hueSegment >= 3 && hueSegment < 4) {
      normalizedRed = 0;
      normalizedGreen = intermediate;
      normalizedBlue = chroma;
    } else if (hueSegment >= 4 && hueSegment < 5) {
      normalizedRed = intermediate;
      normalizedGreen = 0;
      normalizedBlue = chroma;
    } else {
      normalizedRed = chroma;
      normalizedGreen = 0;
      normalizedBlue = intermediate;
    }

    // Adjust the RGB values by adding the calculated intermediate values
    normalizedRed += lightnessAdjustment;
    normalizedGreen += lightnessAdjustment;
    normalizedBlue += lightnessAdjustment;

    // Return the resulting RGB values in the range of 0-255
    return {
      red: Math.round(normalizedRed * 255),
      green: Math.round(normalizedGreen * 255),
      blue: Math.round(normalizedBlue * 255),
    };
  }
}

/**
 * ColorConverter class that extends AbstractConversionMethods.
 */
export class ColorConverter extends AbstractConversionMethods {
  color:
    | string
    | RedGreenBlue
    | HueSaturationLightness
    | HueWhitenessBlackness
    | HueSaturationValue;
  currentModel: string;

  private normalizedColor: RedGreenBlue;

  /**
   * Constructs a ColorConverter object.
   * @param {string} currentModel - The current color model.
   * @param {string|RedGreenBlue|HueSaturationLightness|HueWhitenessBlackness|HueSaturationValue} color - The color value.
   */
  constructor(
    currentModel: string,
    color:
      | string
      | RedGreenBlue
      | HueSaturationLightness
      | HueWhitenessBlackness
      | HueSaturationValue
  ) {
    super();
    this.color = color;

    this.normalizedColor;

    this.currentModel = currentModel;

    this.normalizeToRgb();
  }

  /**
   * Normalizes the color to RGB format to be later convert back into another one
   * @returns {RedGreenBlue} The normalized RGB color value.
   */
  normalizeToRgb(): RedGreenBlue | void {
    switch (this.currentModel) {
      case "hex": {
        this.normalizedColor = this.fromHexToRgb(this.color as string);
        break;
      }

      case "rgb": {
        this.normalizedColor = this.color as RedGreenBlue;
        break;
      }

      case "hsl": {
        this.normalizedColor = this.fromHslToRgb(
          this.color as HueSaturationLightness
        );
        break;
      }
      case "hwb": {
        this.normalizedColor = this.fromHwbToRgb(
          this.color as HueWhitenessBlackness
        );
        break;
      }
      case "hsv": {
        this.normalizedColor = this.fromHsvToRgb(
          this.color as HueSaturationValue
        );
        break;
      }

      default: {
        throw new Error("Invalid color model.");
      }
    }
  }

  /**
   * Converts the color to the specified color model.
   * @param {string} targetModel - The target color model.
   * @returns {string|RedGreenBlue|HueSaturationLightness|HueWhitenessBlackness|HueSaturationValue} The converted color value.
   */
  convertTo(
    targetModel: string
  ):
    | string
    | RedGreenBlue
    | HueSaturationLightness
    | HueWhitenessBlackness
    | HueSaturationValue {
    switch (targetModel) {
      case "hex": {
        return this.fromRgbToHex(this.normalizedColor);
      }
      case "rgb": {
        return this.normalizedColor;
      }
      case "hsl": {
        return this.fromRgbToHsl(this.normalizedColor);
      }
      case "hwb": {
        return this.fromRgbToHwb(this.normalizedColor);
      }
      case "hsv": {
        return this.fromRgbToHsv(this.normalizedColor);
      }

      default: {
        throw new Error("Invalid color model.");
      }
    }
  }

  /**
   * Retrieves all color models for the current color.
   * @returns {Array} An array containing the color values in different color models.
   */
  getAllColorModels(): (
    | string
    | RedGreenBlue
    | HueSaturationLightness
    | HueWhitenessBlackness
    | HueSaturationValue
  )[] {
    return [
      this.fromRgbToHex(this.normalizedColor),
      this.normalizedColor,
      this.fromRgbToHsl(this.normalizedColor),
      this.fromRgbToHwb(this.normalizedColor),
      this.fromRgbToHsv(this.normalizedColor),
    ];
  }
}
