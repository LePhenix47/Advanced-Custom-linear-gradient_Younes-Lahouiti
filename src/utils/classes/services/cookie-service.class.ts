import { parseToJS } from "../../functions/helper-functions/string.functions";

/**
 * Utility class that handles cookies
 *
 * PS: Cookie value aren't overridden
 *
 * example:
 *
 * ```js
  * document.cookie = "test1 = a";
  
  * document.cookie = "test2 = b";
  *
  * console.log(document.cookie) //Returns "test1=a;test2=b"
 * ```
 */
export class CookieService {
  /**
   *
   * @param {any} name Name of the cookie
   * @param {any} value Value of the cookie
   * @param {boolean} cookieCanExpire Boolean to know if the cookie can expire
   * @returns {string} Cookie-string that was created
   *
   * @static
   */
  static setCookie(
    name: any,
    value: any,
    cookieCanExpire: boolean = false
  ): string {
    if (cookieCanExpire) {
      //Gets the time in ms from the next week
      let todayInMilliseconds: number = new Date().getTime();
      let sevenDaysInMilliseconds: number = 1000 * 60 * 60 * 24 * 7;

      //Gets the actual date
      let nextWeekDate: Date = new Date(
        todayInMilliseconds + sevenDaysInMilliseconds
      );
      return (document.cookie = `${name}=${value}; expires="${nextWeekDate}"; sameSite=strict"`);
    }

    return (document.cookie = `${name}=${value}; sameSite=strict`);
  }

  /**
   * Retrieves a cookie by its name
   *
   * @param {string} cookieNameToFind Name of the cookie
   * @returns {null | { name:string, value:any }} Null or an object with the the name and the value of cookie
   * @static
   */
  static getCookieByName(
    cookieNameToFind: string
  ): null | { name: string; value: any } {
    //We get all the cookies
    const cookiesArray = this.getAllCookies(false) as {
      name: string;
      value: any;
    }[];

    //We iterate through the array of cookies and find the cookie wanted
    for (const cookieObject of cookiesArray) {
      const { name, value } = cookieObject;

      const cookieHasBeenFound: boolean = name === cookieNameToFind;

      if (cookieHasBeenFound) {
        return cookieObject;
      }
    }

    return null;
  }

  /**
   * Changes the value of a cookie by its name
   *
   * @param {string} nameOfCookie Name of the cookie
   * @param {any} newValue New value for the cookie
   * @returns {void}
   * @static
   */
  static patchCookieValue(nameOfCookie: string, newValue: any): void {
    document.cookie = `${nameOfCookie}=${newValue}`;
  }

  /**
   * Deletes a cookie by their name
   *
   * @param {string} nameOfCookie Name of the cookie to delete
   * @returns {void}
   * @static
   */
  static deleteCookieByName(nameOfCookie: string): void {
    document.cookie = `${nameOfCookie}=0; expires=${new Date(0)}`;
  }

  /**
   * Gets all cookies stored in the website
   * Returns either a string or an array of objects with the cookie name and value
   *
   * @param {boolean} rawCookies Boolean to know if the cookies retrieved need to be in a string
   * @returns {string | {name:string, value:any}} Either a string or an array of objects containing the cookies
   * @static
   */
  static getAllCookies(
    rawCookies: boolean = false
  ): string | { name: string; value: any }[] {
    if (rawCookies) {
      return document.cookie;
    }

    let rawArrayOfCookies: string[] = document.cookie.split(";");
    const formattedArrayOfCookies: { name: string; value: any }[] = [];

    for (const cookie of rawArrayOfCookies) {
      let name: string = cookie.split("=")[0];
      let value: any = cookie.split("=")[1];
      value = parseToJS(value);

      formattedArrayOfCookies.push({ name, value });
    }

    return formattedArrayOfCookies;
  }

  /**
   * Deletes all cookies stored in the website
   *
   * @returns {void}
   * @static
   */
  static deleteAllCookies(): void {
    let rawArrayOfCookies: string[] = document.cookie.split(";");

    for (const cookie of rawArrayOfCookies) {
      let name: string = cookie.split("=")[0];

      document.cookie = `${name}=0; expires=${new Date(0)}`;
    }
  }
}
