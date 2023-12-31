import { warn } from "./console.helpers";
import { areArraysEqual, isExactlyAnArray } from "./array.helpers";
import { getRandomNumber } from "./number.helpers";

/**
 * Copies an object (or array though using the `copyArray` function is better)
 * without using their reference by using the `structuredClone()` function
 *
 * @param {object | array} object Object or array to copy
 * @returns {object | array} A deep copied object
 */
export function copyObject<DataType>(object: DataType[]): DataType[] {
  const isAnArray = isExactlyAnArray(object);
  if (isAnArray) {
    warn(
      "An array was passed to ths function to copyObjects, it's better to use the copyArray function instead"
    );
  }
  return structuredClone(object);
}

/**
 * Gets the prototype type of a value using `Object.prototype.toString.call()`
 *
 * @param {*} value - The value to get the prototype type from.
 * @returns {string} - The prototype type of the value.
 *
 * @example
 * const array = [1, 2, 3];
 * const object = { name: 'John', age: 30 };
 *
 * console.log(getPrototypeOf(array)); // Output: "Array"
 * console.log(getPrototypeOf(object)); // Output: "Object"
 */
export function getPrototypeOf(value: any): string {
  const prototypeString: string = Object.prototype.toString.call(value);
  const formattedPrototypeString: string = prototypeString.slice(8, -1);
  return formattedPrototypeString;
}

/**
 * Checks if a given value is exactly an object and not an array or null.
 *
 * @param {*} value - The value to check.
 * @returns {boolean} - Returns true if the value is exactly an object, otherwise false.
 */
export function isExactlyAnObject(value: any): boolean {
  const valueType: string = typeof value;
  const valuePrototype: string = getPrototypeOf(value);

  return valueType === "object" && valuePrototype === "Object";
}

/**
 * Checks if two objects are equal up to their property values.
 *
 * @param {object} obj1 - The first object to compare.
 * @param {object} obj2 - The second object to compare.
 * @returns {boolean} - Returns true if the objects are equal, otherwise false.
 */
export function areObjectsEqual<DataType extends object>(
  obj1: DataType,
  obj2: DataType
): boolean {
  const argumentsAreFalsy: boolean = !obj1 || !obj2;

  const doNotHaveObjectType: boolean =
    typeof obj1 !== "object" || typeof obj2 !== "object";

  const areNull: boolean = obj1 === null || obj2 === null;

  const areArrays: boolean = Array.isArray(obj1) || Array.isArray(obj2);

  const argumentsAreNotObjects: boolean =
    areArrays || doNotHaveObjectType || argumentsAreFalsy || areNull;
  if (argumentsAreNotObjects) {
    const typeObj1 = `${typeof obj1} ${getPrototypeOf(obj1)}`;
    const typeObj2 = `${typeof obj2} ${getPrototypeOf(obj2)}`;
    throw new TypeError(
      `Invalid input, expected both arguments to be objects, instead got ${typeObj1} and ${typeObj2}`
    );
  }

  const keys1: any[] = getObjectProperties(obj1);
  const keys2: any[] = getObjectProperties(obj2);

  const hasDifferentAmountOfProperties: boolean = keys1.length !== keys2.length;
  if (hasDifferentAmountOfProperties) {
    return false;
  }

  for (const key in obj1) {
    const propertyDoesNotExistOnOtherObject: boolean =
      !obj2.hasOwnProperty(key);

    if (propertyDoesNotExistOnOtherObject) {
      return false;
    }

    const propOfFirstObject: unknown = obj1[key];
    const propOfSecondObject: unknown = obj2[key];

    const propertiesAreArrays: boolean =
      isExactlyAnArray(propOfFirstObject) &&
      isExactlyAnArray(propOfSecondObject);
    if (propertiesAreArrays) {
      const areDifferentArrays: boolean = !areArraysEqual(
        propOfFirstObject as any[],
        propOfSecondObject as any[]
      );
      if (areDifferentArrays) {
        return false;
      }

      continue;
    }

    const propertiesAreObjects: boolean =
      isExactlyAnObject(propOfFirstObject) &&
      isExactlyAnObject(propOfSecondObject);
    if (propertiesAreObjects) {
      const areDifferentObjects: boolean = !areObjectsEqual(
        propOfFirstObject as object,
        propOfSecondObject as object
      );

      if (areDifferentObjects) {
        return false;
      }
      continue;
    }

    const doesNotHaveSamePropertyValues: boolean =
      propOfFirstObject !== propOfSecondObject;
    if (doesNotHaveSamePropertyValues) {
      return false;
    }
  }

  return true;
}

/**
 * Check if two Maps are equal.
 *
 * @template TKey, TValue
 * @param {Map<TKey, TValue>} map1 The first Map to compare.
 * @param {Map<TKey, TValue>} map2 The second Map to compare.
 * @returns {boolean} True if the Maps are equal, false otherwise.
 */
export function areMapsEqual<TKey, TValue>(
  map1: Map<TKey, TValue>,
  map2: Map<TKey, TValue>
): boolean {
  const haveDifferentLengths: boolean = map1.size !== map2.size;
  if (haveDifferentLengths) {
    return false;
  }

  for (const [key, value] of map1) {
    const doesNotHaveProperty: boolean = !map2.has(key);
    const doesNotHaveSameValue: boolean = map2.get(key) !== value;

    const haveDifferentValues: boolean =
      doesNotHaveProperty || doesNotHaveSameValue;
    if (haveDifferentValues) {
      return false;
    }
  }

  return true;
}

/**
 * Retrieves the values of an object inside an array using `Object.values()`
 *
 * @param {object} object The object to retrieve values from.
 *
 * @returns {any[]} An array containing the property values of the object.
 */
export function getObjectValues<TObj>(object: TObj): TObj[keyof TObj][] {
  // We check that the object passed is indeed an object
  const objectIsDefined: boolean = !Array.isArray(object);

  if (objectIsDefined) {
    // Returns the property values of the object in an array
    return Object.values(object);
  }
  return [];
}

/**
 * Retrieves the properties themselves of an object inside an array using `Object.keys()`
 *
 * @param {object} object The object to retrieve properties from.
 *
 * @returns {keyof TObj[]} An array containing the property names of the object.
 */
export function getObjectProperties<TObj>(object: TObj): (keyof TObj)[] {
  // We check that the object passed is indeed an object
  const objectIsDefined: boolean = !Array.isArray(object);

  if (objectIsDefined) {
    // Returns the property names of the object in an array
    return Object.keys(object) as (keyof TObj)[];
  }
  return [];
}

/**
 * Retrieves the property names and values of an object inside an array using `Object.entries()`
 *
 * @param {object} object The object to retrieve property names and values from.
 *
 * @returns An array containing pairs of property names and values of the object, example:
 *
 * ```js
 * const obj = {foo: "hello", bar: "salve"}
 *
 * let objectKeyValuePair = getObjectEntries(obj);
 *
 * console.log(objectKeyValuePair) → [["foo", "hello"], ["bar", "salve"]]
 * ```
 */
export function getObjectEntries<TObj, TKeyPair = TObj[keyof TObj]>(
  object: TObj
): [keyof TObj, TKeyPair][] {
  //We check that the object passed is indeed an object
  const objectIsDefined: boolean = !Array.isArray(object);

  if (objectIsDefined) {
    //Returns the property names and its values in pair inside an array
    return Object.entries(object) as [keyof TObj, TKeyPair][];
  }
  return [];
}

/*
 In 2024, we will have the `Object.groupBy()` method :

 const array = [1, 2, 3, 4];


 const res =  Object.groupBy(array, (value, index) =>{
    return value % 2 === 0 ? "even" : "odd";
 })

 console.log(res); 
Output → {
    even: [2, 4],
    odd: [1, 3]
  }
 
*/
