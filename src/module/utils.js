import { DND5E } from "./systems/dnd5e";

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

var customSystems = [DND5E];
export var selectedSystem = null;

/**
 * Updates the selected system.
 * @param {*} system - The system to select.
 */
export function updateSelectedSystem(system) {
  selectedSystem = system;
}

/**
 * Retrieves the selected system.
 * @returns {*} - The selected system.
 */
export function getSelectedSystem() {
  return selectedSystem;
}

/**
 * Adds a custom system to the list of systems.
 * @param {*} system - The custom system to add.
 */
export function addCustomSystem(system) {
  customSystems.push(system);
}

/**
 * Retrieves the list of custom systems.
 * @returns {*} - The list of custom systems.
 */
export function getCustomSystems() {
  return customSystems;
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

  if (currentObject.hasOwnProperty("value")) {
    return currentObject.value;
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

/**
 * Parses out plus sumbols and adds values together.
 * @param {*} value - The value to parse.
 * @returns {*} - The value with the pluses parsed out.
 */
export function parsePluses(value) {
  // var index = value.indexOf("{+}");
  // var lastPreviousSpace = value.substring(0, index - 1).lastIndexOf(" ");

  // lastPreviousSpace = lastPreviousSpace == -1 ? 0 : lastPreviousSpace + 1;
  // var previousSection =
  //   lastPreviousSpace == -1 ? value.substring(0, index) : value.substring(lastPreviousSpace, index - 1);

  // var nextSectionBreak = value.indexOf(" ", index + 4);

  // nextSectionBreak = nextSectionBreak != -1 ? value.indexOf(" ", index + 4) : value.substring(index + 4).length;

  // var nextSection = value.substring(index + 4, nextSectionBreak);

  // var result = parseInt(previousSection) + parseInt(nextSection);

  // var beforeIndex = value.indexOf(previousSection);

  // var afterIndex = value.indexOf(nextSection, beforeIndex);

  // var stringToReplace = value.substring(beforeIndex, afterIndex + nextSection.length);
  // value = value.replace(stringToReplace, result);
  // return value;
  while (true) {
    // Match patterns with optional spaces around {+}
    const match = value.match(/(\d+)\s*\{\+\}\s*(\d+)|\d+\{\+\}\d+/);
    if (!match) {
      break; // No more matches found
    }

    const numbers = match[0].trim().split("{+}").map(Number);
    const result = numbers[0] + numbers[1];
    value = value.replace(match[0], result.toString());
  }

  return value;
}
