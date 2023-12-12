/**
 * Converts a string to proper case.
 * @param {string} inputString - The input string to convert.
 * @returns {string} - The converted string in proper case.
 */
export function toProperCase(inputString) {
  return inputString
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Retrieves a nested property from an object using a string path.
 * @param {object} obj - The object from which to retrieve the property.
 * @param {string} path - A string path to the property, with each nested property separated by a dot.
 * @returns {*} - The value of the property at the end of the path, or `undefined` if any part of the path is undefined.
 * @example
 * // returns 2
 * extractPropertyByString({a: {b: 2}}, "a.b");
 */
export function extractPropertyByString(obj, path) {
  const keys = path.split(".");

  let currentObject = obj;

  for (let key of keys) {
    currentObject = currentObject[key];

    // If the property is not found, return undefined
    if (currentObject === undefined) {
      return undefined;
    }
  }

  return currentObject;
}
// export function getPropertyByString(obj, chain) {
//   if (!obj) return null;
//   return chain.split(".").reduce((o, i) => {
//     // console.log(o, i);
//     // var mapple = new Map(Object.entries(o));
//     // console.log(mapple);
//     // if (!o[i] && mapple?.size > 0) {
//     //   console.log(getPropertyByString(mapple, i));
//     // }
//     return o[i]; // ?? mapple.size() > 0 ? getPropertyByString(mapple, i) : null;
//   }, obj);
// }
