/* eslint-disable no-undef */
import {
  extractPropertyByString,
  getCustomSystems,
  getSelectedSystem,
  parsePluses,
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
   * @property {string} name - The name of the column
   * @property {SystemDataColumnType} type - The type of data to display. See below for details.
   * @property {SystemDataColumnColType} coltype - Whether to show, hide, or skip the column
   * @property {SystemDataColumnAlignType} align - The alignment of the column
   * @property {number} colspan - The number of columns to span
   * @property {string} value - The value to display. See below for details.
   */

  /**
   * @typedef ColOptions
   * @property {SystemDataColumnColType} coltype - Whether to show, hide, or skip the column
   * @property {SystemDataColumnAlignType} align - The alignment of the column
   * @property {number} colspan - The number of columns to span
   */

  /**
   * @typedef SystemData
   * @property { string } system - The system this data is for
   * @property { string } author - The author of this data
   * @property { string } name - The name of this data
   * @property { Array<Array<SystemDataColumn>> } rows - The rows of data to display. See below for details.
   * @property { Array<string> } offline_excludes - The types you want to exclude when showing offline players
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
    const excludeTypes = data.offline_excludes ?? DEFAULT_EXCLUDES;

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
        game.actors.filter((actor) => !excludeTypes.includes(actor.type));

    if (!showOnlyOnlineUsers) {
      actorList = actorList.filter((player) => !hiddenCharacters.includes(player.uuid));
    }

    try {
      var finalActorList = actorList
        .map((character) => {
          const userChar = character;

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

    //Prevent html injections!
    switch (type) {
      case "direct":
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

        //Finally detect if a safe string cast is needed.
        if (isSafeStringNeeded) {
          // @ts-ignore
          return new Handlebars.SafeString(value);
        }
        return value;
      case "direct-complex":
        var outputText = "";
        for (const item of value) {
          if (item.type === "exists") {
            var evalue = extractPropertyByString(character, item.value.trim());
            if (evalue) {
              item.text = item.text.replace(item.value.trim(), evalue);
              outputText += item.text;
            } else {
              if (item.else) {
                item.text = item.text.replace(item.value.trim(), item.else);
                outputText += item.text;
              }
            }
          } else if (item.type === "match") {
            var mvalue = extractPropertyByString(character, item.value.trim());
            if (mvalue === item.match) {
              item.text = item.text.replace(item.value.trim(), mvalue);
              outputText += item.text;
            }
          }
        }
        outputText = this.cleanString(outputText);
        return outputText;
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
      template: "modules/theater-of-the-mind/templates/party-sheet.hbs",
      width: "auto",
      height: "auto",
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
