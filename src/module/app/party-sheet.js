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
   * @property {string} value - The value to display. See below for details.
   */

  /**
   * @typedef SystemData
   * @property { string } system - The system this data is for
   * @property { string } author - The author of this data
   * @property { string } name - The name of this data
   * @property { Array<Array<SystemDataColumn>> } rows - The rows of data to display. See below for details.
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
    const excludeTypes = ["npc", "animal", "haven", "monster", "vehicle"];

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
          // const userSys = userChar.system;

          var row_data = [];
          // for (const row_obj, of data.rows) {
          data.rows.map((row_obj) => {
            var customData = {};
            row_obj.forEach((colobj) => {
              var colname = colobj.name;
              if (colobj.coltype === "skip") {
                colname = `~${colname}~`;
              }
              customData[colname] = this.getCustomData(userChar, colobj.type, colobj.value);
            });
            row_data.push(customData);
          });
          // var row_data = [];
          // for (const colobj of row_obj) {
          //   row_data.push(this.getCustomData(userChar, colobj.type, colobj.value));
          // }
          // customData[row_obj.name] = row;

          // for (const colobj of data) {
          //   customData[colobj.name] = this.getCustomData(userChar, colobj.type, colobj.value);
          // }

          // const stats = userSys.abilities;

          // const ac = userSys.attributes.ac.value;

          // const passives = {
          //   prc: userSys.skills.prc.passive,
          //   inv: userSys.skills.inv.passive,
          //   ins: userSys.skills.ins.passive,
          // };

          // const classNamesAndLevels = Object.values(userChar.classes).map((c) => `${c.name} ${c.system.levels}`);

          // const charToken = userChar.prototypeToken;

          // const charSenses = [];
          // if (userSys.attributes.senses.darkvision) {
          //   charSenses.push(`Darkvision ${userSys.attributes.senses.darkvision} ${userSys.attributes.senses.units}`);
          // }
          // if (userSys.attributes.senses.blindsight) {
          //   charSenses.push(`Blindsight ${userSys.attributes.senses.blindsight} ${userSys.attributes.senses.units}`);
          // }
          // if (userSys.attributes.senses.tremorsense) {
          //   charSenses.push(`Tremorsense ${userSys.attributes.senses.tremorsense} ${userSys.attributes.senses.units}`);
          // }
          // if (userSys.attributes.senses.truesight) {
          //   charSenses.push(`Truesight ${userSys.attributes.senses.truesight} ${userSys.attributes.senses.units}`);
          // }
          // if (userSys.attributes.senses.special) {
          //   charSenses.push(userSys.attributes.senses.special);
          // }
          //outData[userChar.name] = row_data;
          //return outData;
          // return [row_data];
          return row_data;
          // return {
          //   uuid: userChar.uuid,
          //   name: userChar.name,
          //   race: userChar.system.details.race,
          //   img: `<input type="image" name="totm-actorimage" data-actorid="${
          //     character.uuid
          //   }" class="token-image" src="${charToken.texture.src}" title="${
          //     charToken.name
          //   }" width="36" height="36" style="transform: rotate(${charToken.rotation ?? 0}deg);"/>`,
          //   senses: charSenses.join(", "),
          //   classNames: classNamesAndLevels.join(" - ") || "",
          //   stats,
          //   ac,
          //   passives,
          // };
        })
        .filter((player) => player);
      return { name: data.name, author: data.author, players: finalActorList, rowcount: data.rows.length };
    } catch (ex) {
      console.log(ex);
    }
    return { name: "", author: "", players: [], rowcount: 0 };
  }

  getCustomData(character, type, value) {
    var objName = "";
    var outstr = "";

    /** @type {any} */
    var objData = {};

    switch (type) {
      case "direct":
        var isSafeStringNeeded = false;

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
            value = value.replace(item, "<br/>");
          }
        }

        //Parse out complex elements (that might contain newline elements we don't want to convert, like ; marks)
        if (value.indexOf("{charactersheet}") > -1) {
          isSafeStringNeeded = true;
          value = value.replace(
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
        // while (value.indexOf("{+}") > -1) {
        //   value = parsePluses(value);
        // }

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
            }
          }
        }
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
      // case "keyarray-string-builder":
      //   objName = value.split("=>")[0].trim();
      //   outstr = value.split("=>")[1].trim();
      //   objData = extractPropertyByString(character, objName);

      //   if (!Array.isArray(objData)) {
      //     objData = Object.keys(objData).map((key) => {
      //       return objData[key];
      //     });
      //   }

      //   var regValue = /(?:\*\.|[\w.]+)+/g;
      //   var reg = new RegExp(regValue);
      //   var allmatches = Array.from(outstr.matchAll(reg), (match) => match[0]);

      //   for (const objSubData of objData) {
      //     for (const m of allmatches) {
      //       var fvalue = extractPropertyByString(objSubData, m);
      //       outstr = outstr.replace(m, fvalue);
      //     }
      //   }
      //   console.log(outstr);
      //   return outstr === value ? "" : outstr;
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
    // @ts-ignore
    const applicableSystems = customSystems.filter((data) => data.system === game.system.id);
    let selectedIdx = getSelectedSystem() ? customSystems.findIndex((data) => data === getSelectedSystem()) : 0;

    if (applicableSystems.length === 1) {
      selectedIdx = customSystems.findIndex((data) => data === applicableSystems[0]);
    }

    // const system = game.system.id;
    // if (!customPlayerData) {
    //   // current system
    //   // @ts-ignore
    //   const system = game.system.id;
    //   switch (system) {
    //     case "dragonbane":
    //       customPlayerData = dragonbane;
    //       break;
    //     case "twdu":
    //       // customPlayerData = twdu;
    //       break;
    //     case "dnd5e":
    //       customPlayerData = DND5E;
    //       break;
    //     default:
    //       console.log("System not supported ", system);
    //       break;
    //   }
    // }
    // console.log(customPlayerData);
    updateSelectedSystem(customSystems[selectedIdx]);
    let { name: sysName, author: sysAuthor, players, rowcount } = this.getCustomPlayerData(getSelectedSystem());
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

  // saveHiddenCharacters() {
  //   const hiddenCharacters = [];
  //   for (const character of this.characterList) {
  //     const checkbox = document.getElementById(`hidden-character-${character}`);
  //     if (checkbox.checked) {
  //       hiddenCharacters.push(character);
  //     }
  //   }
  //   game.settings.set('theater-of-the-mind', 'hiddenCharacters', hiddenCharacters);
  //   const closefunc = this.overrides?.onexit;
  //   if (closefunc) {
  //     closefunc();
  //   }
  //   super.close();
  // }

  // resetEffects() {
  //   // this.effects = game.settings.settings.get('monks-little-details.additional-effects').default;
  //   this.refresh();
  // }

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

  // updateCurrentSystem(index) {
  //   // @ts-ignore
  //   game.settings.set("theater-of-the-mind", "currentSystem", index);
  //   // @ts-ignore
  //   this.render(true);
  // }

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
    // $('button[name="submit"]', html).click(this.saveHiddenCharacters.bind(this));
    // $('button[name="reset"]', html).click(this.resetEffects.bind(this));
  }
}
