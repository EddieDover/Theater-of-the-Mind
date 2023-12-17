/* eslint-disable no-undef */
import { THEATER_SOUNDS } from "./sounds.js";
import { registerSettings } from "./app/settings.js";
import { PartySheetForm } from "./app/party-sheet.js";
import { addCustomSystem, toProperCase } from "./utils.js";

let isSyrinscapeInstalled = false;
let isMidiQoLInstalled = false;

/**
 *
 * @param {any} message The message to send to console.log
 */
function log(message) {
  console.log("Theater of the Mind | ", message);
}

// @ts-ignore
Handlebars.registerHelper("hccontains", function (needle, haystack, options) {
  // @ts-ignore
  needle = Handlebars.escapeExpression(needle);
  // @ts-ignore
  haystack = game.settings.get("theater-of-the-mind", "hiddenCharacters") ?? [];
  return haystack.indexOf(needle) > -1 ? options.fn(this) : options.inverse(this);
});

// @ts-ignore
Handlebars.registerHelper("hcifgte", function (v1, v2, options) {
  if (v1 >= v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

// @ts-ignore
Handlebars.registerHelper("hciflte", function (v1, v2, options) {
  if (v1 <= v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

// @ts-ignore
Handlebars.registerHelper("checkIndex", function (index, options) {
  if (index % 2 == 0) {
    return options.fn(this);
  }
  return options.inverse(this);
});

// @ts-ignore
Handlebars.registerHelper("hcifhidden", function (v1, options) {
  if (v1.startsWith("~") && v1.endsWith("~")) {
    return options.fn(this);
  }
  return options.inverse(this);
});

// @ts-ignore
Handlebars.registerHelper("hcifcolspan", function (row, options) {
  if (row.colspan) {
    return options.fn(this);
  }
  return options.inverse(this);
});

// @ts-ignore
Handlebars.registerHelper("getColSpan", function (row, options) {
  return options.fn(row.colspan);
});

// @ts-ignore
Handlebars.registerHelper("eachInMap", function (map, block) {
  var out = "";
  Object.keys(map).map(function (prop) {
    out += block.fn({ key: prop, value: map[prop] });
  });
  return out;
});

// @ts-ignore
Handlebars.registerHelper("debug", function (data) {
  console.log(data);
  return "";
});

// @ts-ignore
Handlebars.registerHelper("getKeys", function (obj, options) {
  const keys = Object.keys(obj);
  let result = "";
  for (let i = 0; i < keys.length; i++) {
    result += options.fn(keys[i]);
  }
  return result;
});

// @ts-ignore
Handlebars.registerHelper("getData", function (obj, key) {
  return obj[key];
});

// @ts-ignore
Handlebars.registerHelper("toUpperCase", function (str) {
  return toProperCase(str);
});

// @ts-ignore
Handlebars.registerHelper("ifCond", function (v1, operator, v2, options) {
  switch (operator) {
    case "==":
      return v1 == v2 ? options.fn(this) : options.inverse(this);
    case "===":
      return v1 === v2 ? options.fn(this) : options.inverse(this);
    case "!=":
      return v1 != v2 ? options.fn(this) : options.inverse(this);
    case "!==":
      return v1 !== v2 ? options.fn(this) : options.inverse(this);
    case "<":
      return v1 < v2 ? options.fn(this) : options.inverse(this);
    case "<=":
      return v1 <= v2 ? options.fn(this) : options.inverse(this);
    case ">":
      return v1 > v2 ? options.fn(this) : options.inverse(this);
    case ">=":
      return v1 >= v2 ? options.fn(this) : options.inverse(this);
    case "&&":
      return v1 && v2 ? options.fn(this) : options.inverse(this);
    case "||":
      return v1 || v2 ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});

let currentPartySheet = null;

/**
 *
 */
function togglePartySheet() {
  if (currentPartySheet?.rendered) {
    currentPartySheet.close();
  } else {
    currentPartySheet = new PartySheetForm();
    // @ts-ignore
    currentPartySheet.render(true);
  }
}

/**
 * Load all the user-provided templates for systems
 * @param {string} path The path to the template
 * @returns {Promise<void>} A promise that resolves when the template is loaded
 */
async function loadSystemTemplate(path) {
  const templateName = path.split("/").pop().split(".")[0];
  log(`Loading template: ${templateName}`);
  const template = JSON.parse(await fetch(path).then((r) => r.text()));
  if (template.name && template.author && template.system && template.rows) {
    console.log(`${path} - Good Template`);
    addCustomSystem(template);
  } else {
    console.log(`${path} - Bad Template`);
  }
}

async function loadSystemTemplates() {
  // Look inside the "totm" folder. Any JSON file inside should be loaded
  const templatePaths = [];
  // @ts-ignore
  const templateFiles = await FilePicker.browse("data", "totm"); // `modules/${MODULE_NAME}/templates`);
  console.log(templateFiles.files);

  templateFiles.files.forEach((file) => {
    if (file.endsWith(".json")) {
      templatePaths.push(file);
    }
  });

  templatePaths.forEach(async (path) => {
    await loadSystemTemplate(path);
  });
  // for (const file of templateFiles.files) {
  //   if (file.endsWith(".html")) {
  //     templatePaths.push(file);
  //   }
  // }
}

/**
 *
 * @param {string} weapon The weapon type
 * @param {boolean} crit If the hit was a crit
 * @param {boolean} hitmiss If the action was a hit or miss
 * @param {object} override Setting overrides
 */
async function playSound(weapon, crit, hitmiss, override = null) {
  if (!isSyrinscapeInstalled || !isMidiQoLInstalled) {
    return;
  }

  const hitmisscrit = override ? "any" : crit ? "critical" : hitmiss ? "hit" : "miss";

  // @ts-ignore
  if (!game.settings.get("theater-of-the-mind", "enableSounds")) {
    return;
  }

  // Get the sound from the THEATER_SOUNDS object
  const weaponsound = THEATER_SOUNDS[weapon.toLowerCase()];

  if (!weaponsound) {
    log(`No sound key found [${weapon.toLowerCase()}].`);
    return;
  }

  const subsound = hitmisscrit.toLowerCase() || "any";
  const soundid = weaponsound[subsound];

  if (!soundid) {
    log(`Key found: [${weapon.toLowerCase()}], No sound sub-type found [${subsound}].`);
  } else {
    // @ts-ignore
    game.syrinscape.playElement(soundid);
  }
}
/* Hooks */

// @ts-ignore
Hooks.on("init", () => {
  log("Initializing");

  registerSettings();
});

//
// @ts-ignore
Hooks.on("midi-qol.AttackRollComplete", async (roll) => {
  const weapon = roll.item.name;
  const roll_results = roll.attackTotal;
  const target = roll?.targets?.values().next().value || null;
  const target_actor = target?.document?.actors?.values().next().value || null;
  const ac = target_actor?.system?.attributes?.ac?.value || null;

  if (ac) {
    playSound(weapon, roll_results === 20, roll_results >= ac);
  }
});

// @ts-ignore
Hooks.on("midi-qol.preambleComplete", async (roll) => {
  if (roll?.item?.type != "spell") {
    return;
  }
  playSound(roll.item.name, false, false, "any");
});

// @ts-ignore
Hooks.on("ready", async () => {
  log("Ready");

  // @ts-ignore
  isSyrinscapeInstalled = game.modules.get("fvtt-syrin-control")?.active || false;
  log(`Syrinscape is installed: ${isSyrinscapeInstalled}`);

  // @ts-ignore
  isMidiQoLInstalled = game.modules.get("midi-qol")?.active || false;
  log(`Midi-QoL is installed: ${isMidiQoLInstalled}`);

  const soundsReady = isSyrinscapeInstalled && isMidiQoLInstalled;
  log(`Sounds enabled: ${soundsReady}`);

  log("Loading templates");
  await loadSystemTemplates();
});

// @ts-ignore
Hooks.on("renderPlayerList", () => {
  // @ts-ignore
  const showOnlyOnlineUsers = game.settings.get("theater-of-the-mind", "enableOnlyOnline");

  // @ts-ignore
  if (!game.user.isGM || !showOnlyOnlineUsers) {
    return;
  }
  if (currentPartySheet?.rendered) {
    // PartySheetDialog.data.content = convertPlayerDataToTable();
    currentPartySheet.render(true);
  }
});

// @ts-ignore
Hooks.on("renderSceneControls", () => {
  // @ts-ignore
  const showButton = game.user.isGM;

  // @ts-ignore
  const button = $(`<li class="control-tool "
            data-tool="PartySheet"
            aria-label="Show Party Sheet"
            role="button"
            data-tooltip="Party Sheet">
            <i class="fas fa-users"></i>
        </li>`);
  button.click(() => togglePartySheet());
  // @ts-ignore
  const controls = $("#tools-panel-token");

  if (showButton && controls.find(".control-tool[data-tool='PartySheet']")) {
    controls.append(button);
  } else if (!showButton) {
    controls.find(".control-tool[data-tool='PartySheet']").remove();
  }
});
