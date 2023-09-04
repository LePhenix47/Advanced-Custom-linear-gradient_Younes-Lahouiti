/**
 * Utility class that sets and clears intervals
 */
export class IntervalService {
  private static id: NodeJS.Timer;
  private static arrayOfIds: NodeJS.Timer[] = [];

  /**
   * Method that creates an interval
   *
   * @param milliseconds Duration of the timer in milliseconds before executing the callback function
   * @param {(...args: any) => any | void} callback Callback function that will be called after the timer runs out
   * @param {...functionArguments} functionArguments Arguments for the callback function
   *
   * @returns A number as an ID for the interval
   *
   * @example
   * let fct = (text) => {
   *   console.log(text);
   * };
   *
   * let intervalTrigger = Interval.set(2_500, fct, "Hello world!");
   *
   */
  static set(
    milliseconds: number,
    callback: (...functionArguments: any) => any,
    ...functionArguments: any[]
  ): NodeJS.Timer {
    this.id = setInterval(() => {
      callback(...functionArguments);
    }, milliseconds);

    this.arrayOfIds.push(this.id);

    return this.id;
  }

  /**
   * Method that clears an interval
   *
   * @param {number} id ID of the interval to clear (stored inside the trigger of the interval)
   *
   * @example
   *
   * let fct = (text) => {
   *   console.log(text);
   * };
   *
   * let intervalTrigger = Interval.set(2_500, fct, "Hello world!");
   *
   * // ...
   *
   * Interval.clear(intervalTrigger);
   *
   */
  static clear(id: NodeJS.Timer): void {
    const actualId: NodeJS.Timer = this.arrayOfIds.find(
      (idNumber: NodeJS.Timer) => {
        return idNumber === id;
      }
    );

    clearInterval(actualId);

    this.arrayOfIds = this.arrayOfIds.filter((idNumber: NodeJS.Timer) => {
      return idNumber !== actualId;
    });
  }
}
