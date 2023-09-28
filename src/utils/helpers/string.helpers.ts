//Utils

import { PercentageString } from "@utils/variables/types/unit-types.variables";
import { log } from "./console.helpers";
import { stringPercentageToNumber } from "./number.helpers";
/**
 * Converts a string in camelCase to PascalCase.
 * @param {string} inputString - The camelCase string to convert.
 * @returns {string} The PascalCase version of the input string.
 */
export function camelToPascalCase(inputString: string): string {
  return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}

/**
 * Converts a string in kebab-case to camelCase.
 * @param {string} string - The kebab-case string to convert.
 * @returns {string} The camelCase version of the input string.
 */
export function kebabToCamelCase(string: string): string {
  const camelCaseString: string = string.replace(
    /-([a-z])/g,
    (match, group) => {
      return group.toUpperCase();
    }
  );

  return camelCaseString;
}

/**
 * Formats a string containing inline CSS style declarations to a JavaScript object as a string **(not JSON)**
 * @param {string} styleValue - The string containing style declarations.
 * @returns {string} A string representation of a JavaScript object containing the style properties.
 */
export function formatStyleAttribute(styleValue: string): string {
  // Split the styleValue by semicolons to get individual style declarations
  const styleDeclarations: string[] = styleValue
    .replaceAll(/\"/g, "")
    .split(";")
    .filter(Boolean);

  // Create an object to store the style properties
  const styleObject: Record<string, string> = {};

  for (const declaration of styleDeclarations) {
    // Split each style declaration by the colon to separate property and value
    const [property, value]: string[] = declaration
      .split(":")
      .map((part) => part.trim());

    // Convert the property to camelCase
    const camelCaseProperty: string = kebabToCamelCase(property);

    let formattedValue: string | number = value;

    const isStopOpacity: boolean = camelCaseProperty === "stopOpacity";
    if (isStopOpacity) {
      formattedValue = stringPercentageToNumber(
        formattedValue as PercentageString
      );
    }

    // Add the property and value to the style object
    styleObject[camelCaseProperty] = formattedValue as string;
  }

  // Convert the style object to a string
  const formattedStyle: string = JSON.stringify(styleObject).replaceAll(
    /"([^"]+)":/g,
    "$1:"
  );

  return formattedStyle;
}

/**
 * **Formats a given string into different cases:**
 *
 * `lowercase, UPPERCASE, Title Case and Sentence case`
 *
 * @param {string} string - The string to format
 * @param {string} option - The option to use for formatting. Valid options are `"lowercase"`, `"uppercase"`, `"titlecase"`, or `"sentencecase"`
 *
 * @returns {string} The formatted string
 *
 * @throws {Error} If an invalid option is provided
 * @throws {TypeError} If either the string or the option parameter is not a string
 * @throws {TypeError} If either the string or the option parameter is not a string
 * @throws {Error} If an invalid option is provided
 */
export function formatStringCase(string: string, option: string): string {
  const hasInvalidArguments =
    typeof string !== "string" || typeof option !== "string";
  if (hasInvalidArguments) {
    throw new TypeError(
      `Invalid arguments, expected string and option to be strings, instead got respective types: ${typeof string} and ${typeof option}`
    );
  }

  const formattedOption: string = option.toLowerCase().trim();

  switch (formattedOption) {
    case "lowercase": {
      return string.toLowerCase();
    }

    case "uppercase": {
      return string.toUpperCase();
    }

    case "titlecase": {
      const words = string.split(" ");

      for (let i = 0; i < words.length; i++) {
        const firstLetter = words[i].charAt(0).toUpperCase();

        const remainingLetters = words[i].slice(1).toLowerCase();

        words[i] = firstLetter + remainingLetters;
      }

      return words.join(" ");
    }

    case "sentencecase": {
      const sentences = string.split(/(?<=[.?!])/);

      for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i];

        const trimmedSentence = sentence.trim();

        const sentenceHasNoWords = trimmedSentence.length === 0;
        if (sentenceHasNoWords) {
          sentences[i] = "";
          continue;
        }

        // We only make the first letter of the sentence uppercased
        const firstChar = trimmedSentence.charAt(0).toUpperCase();

        // We only make the rest of the sentence lowercased
        const restOfSentence = trimmedSentence.slice(1).toLowerCase();

        sentences[i] = firstChar + restOfSentence;
      }

      return sentences.join(" ");
    }

    default: {
      throw new Error(
        `Formatting text error, option not available for: ${option}`
      );
    }
  }
}

// Example usage:
// const kebabCaseString = "my-kebab-case-string";
// const camelCaseString = kebabToCamelCase(kebabCaseString);
// console.log(camelCaseString); // Output: "myKebabCaseString"

/**
 * Removes diacritical marks (accents) from a string.
 *
 * @param {string} string - The string to remove diacritical marks from.
 * @returns {string} The string without diacritical marks.
 */
export function removeAccents(string: string): string {
  return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Tests a regular expression against a string and
 * returns a boolean value indicating whether the string matches the RegExp pattern.
 *
 * @param {string} string - The string to test against the regular expression.
 * @param {RegExp} RegularExpression - The regular expression to test against the string.
 *
 * @returns {boolean} - A boolean value indicating whether the regular expression matches the string.
 */
export function testRegExp(string: string, RegularExpression: RegExp): boolean {
  return RegularExpression.test(string);
}

/**
 * Tests a regular expression against a string and returns an array of matches.
 *
 * @param {string} string - The string to test against the regular expression.
 * @param {RegExp} regularExpression - The regular expression to test against the string.
 *
 * @returns {Array<string>} - An array of matches found in the string.
 */
export function matchRegExp(
  string: string,
  regularExpression: RegExp
): string[] {
  const matches = string.match(regularExpression);
  return matches || [];
}

/**
 * Copies the given text to the clipboard.
 *
 * @param {string} textToCopy - The text to be copied to the clipboard.
 *
 * @returns {Promise<void>} - A Promise that resolves when the text has been successfully copied to the clipboard.
 */
export function copyTextToClipBoard(textToCopy: string): Promise<void> {
  return navigator.clipboard.writeText(textToCopy);
}
/**

Splits a string into an array of substrings using the specified separator.

@param {string} string - The string to split.

@param {string|RegExp} character - The separator to use when splitting the string.

@returns {string[]} An array of substrings created by splitting the original string using the specified separator.

*/
export function splitString(
  string: string,
  character: string | RegExp
): string[] {
  return string.split(character);
}

/**

Slices a string to extract a portion of it between the start and end indexes.

@example
Ex: We have "Saturday" and we want to just end up with "at"

```js
let str = "Saturday"
str = sliceString(str, 1, 3); //"at"

let str2 = "#FFFFFF"
str2 = sliceSting(str2, 1); //"FFFFFF"


let str3 = "Hello world"
str3 = sliceString(str3, -5) //"world"
```

@param {string} string - The input string to slice.
@param {number} startIndex - The index of the beginning of the slice.
@param {number} endIndex - The index of the end of the slice.

@returns {string} - The portion of the string between the start and end indexes.
*/
export function sliceString(
  string: string,
  startIndex: number,
  endIndex?: number
): string {
  return string.slice(startIndex, endIndex);
}

/**
 * Returns a substring of the given string based on the specified start and end index.
 * @param {string} string - The string to extract the substring from.
 * @param {number} startIndex - The starting index of the substring (inclusive).
 * @param {number} endIndex - The ending index of the substring (exclusive).
 * @returns {string} The extracted substring.
 */
export function getSubtring(
  string: string,
  startIndex: number,
  endIndex: number
): string {
  return string.substring(startIndex, endIndex);
}

/**
 *  Function that replaces all instances of a given character or word with a new one in a string of text.
 *
 * @param {string} stringOfText - The entire string of text.
 * @param {string} replacedText - The character or word to be replaced.
 * @param {string} replacer - The character or word that will replace the old one.
 *
 * @returns {string} - The updated string of text.
 */
export function replaceText(
  stringOfText: string,
  replacedText: string | RegExp,
  replacer: string
): string {
  //@ts-ignore
  return stringOfText.replaceAll(replacedText, replacer);
}

/**
 * Function that formats a number as a percentage string with a '%' symbol appended at the end.
 *
 * @param {number} number - The number to be formatted as a percentage.
 * @returns {string} - The formatted percentage string.
 */
export function toPercent(number: number): string {
  return number.toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 0,
  });
}

/**
 * Generates an array of characters based on the provided Unicode character codes range
 * How the fromCodePoint method works:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint
 *
 * @param {number} startCodePoint - The Unicode code point of the starting character (inclusive)
 * @param {number} endCodePoint - The Unicode code point of the ending character (inclusive too)
 *
 * @returns {string[]} An array of characters within the specified Unicode range
 */
export function generateUnicodeCharFromRange(
  startCodePoint: number,
  endCodePoint: number
): string[] {
  const characterList: string[] = [];

  for (let codePoint = startCodePoint; codePoint <= endCodePoint; codePoint++) {
    const character: string = String.fromCodePoint(codePoint);
    characterList.push(character);
  }

  return characterList;
}

/**
 * Parses a JSON string and returns the resulting JavaScript object.
 *
 * @param {string} string - A string that contains a valid JSON data.
 *
 * @returns {any} The parsed JavaScript object from the JSON data.
 */
export function parseToJS(string: string): any {
  return JSON.parse(string);
}

/**
 * Converts a JavaScript value to a JSON string
 *
 * @param {any} value - A JavaScript value, usually an object or an array, to be converted to a JSON string
 *
 * @returns {string} The JSON string representation of the input value
 */
export function stringifyToJSON(value: any): string {
  return JSON.stringify(value);
}
