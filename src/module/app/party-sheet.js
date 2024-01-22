/* eslint-disable no-undef */
import {
  extractPropertyByString,
  getCustomSystems,
  getSelectedSystem,
  parsePluses,
  trimIfString,
  updateSelectedSystem,
} from "../utils.js";
import { HiddenCharactersSettings } from "./hidden-characters-settings.js";

const NEWLINE_ELEMENTS = ["{newline}", "{nl}", ";"];
const DEFAULT_EXCLUDES = ["npc"];
// @ts-ignore
export class PartySheetForm extends FormApplication {
  constructor() {
    super();
  }

  /**
   * @typedef { 'direct' | 'math' | 'direct-complex' | 'string' | 'array-string-builder' } SystemDataColumnType
   * @typedef { 'show' | 'hide' | 'skip' } SystemDataColumnColType
   * @typedef { 'left' | 'center' | 'right' } SystemDataColumnAlignType
   */

  /**
   * @typedef SystemDataColumn
   * @property {string} name - The name of the column.
   * @property {SystemDataColumnType} type - The type of data to display. See below for details.
   * @property {SystemDataColumnColType} coltype - Whether to show, hide, or skip the column.
   * @property {SystemDataColumnAlignType} align - The alignment of the column.
   * @property {number} colspan - The number of columns to span.
   * @property {number} maxwidth - The maximum width of the column in pixels.
   * @property {number} minwidth - The minimum width of the column in pixels.
   * @property {string} value - The value to display. See below for details.
   */

  /**
   * @typedef ColOptions
   * @property {SystemDataColumnColType} coltype - Whether to show, hide, or skip the column.
   * @property {SystemDataColumnAlignType} align - The alignment of the column.
   * @property {number} colspan - The number of columns to span.
   * @property {number} maxwidth - The maximum width of the column in pixels.
   * @property {number} minwidth - The minimum width of the column in pixels.
   */

  /**
   * @typedef SystemData
   * @property { string } system - The system this data is for.
   * @property { string } author - The author of this data.
   * @property { string } name - The name of this data.
   * @property { Array<Array<SystemDataColumn>> } rows - The rows of data to display. See below for details.
   * @property { string } offline_excludes_property - The property to use to exclude players. Note: This is optional and defaults to the actors.type property.
   * @property { Array<string> } offline_excludes - The types you want to exclude when showing offline players.
   * @property { string } offline_includes_property - The property to use to show players online.
   * @property { Array<string> } offline_includes - The types you want to include when showing online players.
   */

  /**
   * @typedef { {name: string, author: string, players: any, rowcount: number} } CustomPlayerData
   */

  /**
   * Get the custom player data.
   * @param { SystemData } data - The system data
   * @returns { CustomPlayerData } The custom player data
   * @memberof PartySheetForm
   */

  getCustomPlayerData(data) {
    const excludeTypes = data?.offline_excludes ? data.offline_excludes : DEFAULT_EXCLUDES;

    if (!data) {
      return { name: "", author: "", players: [], rowcount: 0 };
    }

    // @ts-ignore
    const showOnlyOnlineUsers = game.settings.get("theater-of-the-mind", "enableOnlyOnline");
    // @ts-ignore
    const hiddenCharacters = game.settings.get("theater-of-the-mind", "hiddenCharacters");

    let actorList = showOnlyOnlineUsers
      ? // @ts-ignore
        game.users.filter((user) => user.active && user.character).map((user) => user.character)
      : // @ts-ignore
        game.actors.filter((actor) => {
          if (data.offline_includes_property && data.offline_includes) {
            var propval = extractPropertyByString(actor, data.offline_includes_property);
            return data.offline_includes.includes(propval);
          } else if (excludeTypes) {
            var incpropval = actor.type;
            if (data.offline_excludes_property) {
              incpropval = extractPropertyByString(actor, data.offline_excludes_property);
            }
            return !excludeTypes.includes(incpropval);
          }
        });

    if (!showOnlyOnlineUsers) {
      actorList = actorList.filter((player) => !hiddenCharacters.includes(player.uuid));
    }

    try {
      var finalActorList = actorList
        .map((character) => {
          const userChar = character;

          // @ts-ignore
          if (game.settings.get("theater-of-the-mind", "showDebugInfo")) {
            console.log(userChar);
          }

          var row_data = [];

          data.rows.map((row_obj) => {
            var customData = {};

            row_obj.forEach((colobj) => {
              var colname = colobj.name;
              customData[colname] = {
                text: this.getCustomData(userChar, colobj.type, colobj.value),
                options: {
                  align: colobj.align,
                  colspan: colobj.colspan,
                  maxwidth: colobj.maxwidth,
                  minwidth: colobj.minwidth,
                  coltype: colobj.coltype,
                },
              };
            });
            row_data.push(customData);
          });

          return row_data;
        })
        .filter((player) => player);
      return { name: data.name, author: data.author, players: finalActorList, rowcount: data.rows.length };
    } catch (ex) {
      console.log(ex);
    }
    return { name: "", author: "", players: [], rowcount: 0 };
  }

  /**
   * Clean a string of html injection.
   * @param {string} str - The string to clean
   * @returns {string} The cleaned string
   * @memberof PartySheetForm
   */
  cleanString(str) {
    return str.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  }

  /**
   * Parse a direct string.
   * @param {*} character - The character to parse
   * @param {*} value - The value to parse
   * @returns {[boolean, string]} Whether a safe string is needed and the value
   */
  parseDirect(character, value) {
    var isSafeStringNeeded = false;

    value = this.cleanString(value);

    //Parse out normal data
    for (const m of value.split(" ")) {
      var fvalue = extractPropertyByString(character, m);
      if (fvalue !== undefined) {
        value = value.replace(m, fvalue);
      }
    }

    //Parse out newline elements
    for (const item of NEWLINE_ELEMENTS) {
      if (value.indexOf(item) > -1) {
        isSafeStringNeeded = true;
        value = value.replaceAll(item, "<br/>");
      }
    }

    //Parse out complex elements (that might contain newline elements we don't want to convert, like ; marks)
    if (value.indexOf("{charactersheet}") > -1) {
      isSafeStringNeeded = true;
      value = value.replaceAll(
        "{charactersheet}",
        `<input type="image" name="totm-actorimage" data-actorid="${character.uuid}" class="token-image" src="${
          character.prototypeToken.texture.src
        }" title="${character.prototypeToken.name}" width="36" height="36" style="transform: rotate(${
          character.prototypeToken.rotation ?? 0
        }deg);"/>`,
      );
      value = "<div class='flex-tc'>" + value + "</div>";
    }

    value = parsePluses(value);

    return [isSafeStringNeeded, value];
  }

  /**
   * Get the custom data for a character.
   * @param {*} character - The character to get the data for
   * @param {*} type - The type of data to get
   * @param {*} value - The value to get
   * @returns {string} The text to render
   * @memberof PartySheetForm
   */
  getCustomData(character, type, value) {
    var objName = "";
    var outstr = "";

    /** @type {any} */
    var objData = {};
    var isSafeStringNeeded = false;

    //Prevent html injections!
    switch (type) {
      case "direct":
        [isSafeStringNeeded, value] = this.parseDirect(character, value);

        //Finally detect if a safe string cast is needed.
        if (isSafeStringNeeded) {
          // @ts-ignore
          return new Handlebars.SafeString(value);
        }
        return value;
      case "direct-complex":
        // Call .trim() on item.value but only if it's a string
        var outputText = "";
        for (var item of value) {
          item = trimIfString(item);

          if (item.type === "exists") {
            var evalue = extractPropertyByString(character, item.value);
            if (evalue) {
              item.text = item.text.replace(item.value, evalue);
              outputText += item.text;
            } else {
              if (item.else) {
                var nvalue = extractPropertyByString(character, item.else);
                if (nvalue) {
                  outputText += nvalue;
                } else {
                  outputText += item.else;
                }
              }
            }
          } else if (item.type === "match") {
            var mvalue = extractPropertyByString(character, item.value);
            var match_value = extractPropertyByString(character, item.match) ?? item.match;
            if (mvalue === match_value) {
              outputText += extractPropertyByString(character, item.text) ?? item.text;
            } else {
              if (item.else) {
                var mnvalue = extractPropertyByString(character, item.else);
                if (mnvalue) {
                  outputText += mnvalue;
                } else {
                  outputText += item.else;
                }
              }
            }
          } else if (item.type === "match-any") {
            var mavalues = (Array.isArray(item.value) ? item.value : [item.value]).map((val) =>
              extractPropertyByString(character, val),
            );
            var maatch_value = extractPropertyByString(character, item.match) ?? item.match;

            for (const maval of mavalues) {
              if (maval === maatch_value) {
                outputText += extractPropertyByString(character, item.text) ?? item.text;
              } else {
                if (item.else) {
                  var manvalue = extractPropertyByString(character, item.else);
                  if (manvalue) {
                    outputText += manvalue;
                  } else {
                    outputText += item.else;
                  }
                }
              }
            }
          }
        }
        // outputText = this.cleanString(outputText);
        //return outputText;
        [isSafeStringNeeded, outputText] = this.parseDirect(character, outputText);
        // @ts-ignore
        return isSafeStringNeeded ? new Handlebars.SafeString(outputText) : outputText;

      //regex match properties as [a-z][A-Z].*?
      case "charactersheet":
        // @ts-ignore
        return new Handlebars.SafeString(
          `<input type="image" name="totm-actorimage" data-actorid="${character.uuid}" class="token-image" src="${
            character.prototypeToken.texture.src
          }" title="${character.prototypeToken.name}" width="36" height="36" style="transform: rotate(${
            character.prototypeToken.rotation ?? 0
          }deg);"/>`,
        );
      case "array-string-builder":
        objName = value.split("=>")[0].trim();
        outstr = value.split("=>")[1].trim();

        objData = extractPropertyByString(character, objName);

        if (!Array.isArray(objData)) {
          objData = Object.keys(objData).map((key) => {
            return objData[key];
          });
        }

        var regValue = /(?:\*\.|[\w.]+)+/g;
        var reg = new RegExp(regValue);
        var allmatches = Array.from(outstr.matchAll(reg), (match) => match[0]);

        for (const objSubData of objData) {
          for (const m of allmatches) {
            outstr = outstr.replace(m, extractPropertyByString(objSubData, m));
          }
        }
        outstr = this.cleanString(outstr);
        return outstr === value ? "" : outstr;
      case "string":
        return value;
      default:
        return "";
    }
  }

  // eslint-disable-next-line no-unused-vars
  _updateObject(event, formData) {
    // Update the currently loggged in players
  }

  getData(options) {
    // @ts-ignore
    const hiddenCharacters = game.settings.get("theater-of-the-mind", "hiddenCharacters");
    // @ts-ignore
    const enableOnlyOnline = game.settings.get("theater-of-the-mind", "enableOnlyOnline");
    // @ts-ignore
    var customSystems = getCustomSystems();

    const applicableSystems = customSystems.filter((data) => {
      // @ts-ignore
      return data.system === game.system.id;
    });
    let selectedIdx = getSelectedSystem() ? applicableSystems.findIndex((data) => data === getSelectedSystem()) : 0;

    // if (applicableSystems.length === 1) {
    //   selectedIdx = customSystems.findIndex((data) => data === applicableSystems[0]);
    // }

    updateSelectedSystem(applicableSystems[selectedIdx]);
    var selectedSystem = getSelectedSystem();
    let { name: sysName, author: sysAuthor, players, rowcount } = this.getCustomPlayerData(selectedSystem);
    // @ts-ignore
    return mergeObject(super.getData(options), {
      hiddenCharacters,
      enableOnlyOnline,
      rowcount,
      players,
      applicableSystems,
      selectedName: sysName,
      selectedAuthor: sysAuthor,
      // @ts-ignore
      overrides: this.overrides,
    });
  }

  static get defaultOptions() {
    // @ts-ignore
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "totm-party-sheet",
      classes: ["form"],
      title: "Party Sheet",
      // resizable: true,
      template: "modules/theater-of-the-mind/templates/party-sheet.hbs",
      // @ts-ignore
      width: "auto", // $(window).width() > 960 ? 960 : $(window).width() - 100,
      height: "auto", //$(window).height() > 800 ? 800 : $(window).height() - 100,
    });
  }

  openOptions(event) {
    event.preventDefault();
    const overrides = {
      onexit: () => {
        // this.close();
        setTimeout(() => {
          // @ts-ignore
          this.render(true);
        }, 350);
      },
    };
    const hcs = new HiddenCharactersSettings(overrides);
    // @ts-ignore
    hcs.render(true);
  }

  closeWindow() {
    // @ts-ignore
    this.close();
  }

  openActorSheet(event) {
    event.preventDefault();
    const actorId = event.currentTarget.dataset.actorid;
    // @ts-ignore
    const actor = game.actors.get(actorId.replace("Actor.", ""));
    actor.sheet.render(true);
  }

  changeSystem(event) {
    var selectedSystemName = event.currentTarget.value.split("___")[0];
    var selectedSystemAuthor = event.currentTarget.value.split("___")[1];
    var selectedIndex =
      getCustomSystems().findIndex(
        (data) => data.name === selectedSystemName && data.author === selectedSystemAuthor,
      ) ?? -1;
    if (selectedIndex != -1) {
      updateSelectedSystem(getCustomSystems()[selectedIndex]);
    }
    // @ts-ignore
    this.render(true);
  }

  activateListeners(html) {
    super.activateListeners(html);
    // @ts-ignore
    $('button[name="totm-options"]', html).click(this.openOptions.bind(this));
    // @ts-ignore
    $('button[name="totm-close"]', html).click(this.closeWindow.bind(this));
    // @ts-ignore
    $('input[name="totm-actorimage"]', html).click(this.openActorSheet.bind(this));
    // @ts-ignore
    $('select[name="totm-system"]', html).change(this.changeSystem.bind(this));
  }
}
