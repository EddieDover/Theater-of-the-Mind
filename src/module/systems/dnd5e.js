export const DND5E = {
  rows: [
    [
      // {
      //   "name": "Sheet",
      //   "type": "charactersheet",
      //   "coltype": "hide",
      //   "value": "",
      // },
      {
        "name": "Name",
        "type": "direct",
        "coltype": "show",
        "value": "{charactersheet} name {newline} system.details.race",
      },
      {
        "name": "STR",
        "type": "direct",
        "coltype": "show",
        "value": "system.abilities.str.value",
      },

      {
        "name": "DEX",
        "type": "direct",
        "coltype": "show",
        "value": "system.abilities.dex.value",
      },

      {
        "name": "CON",
        "type": "direct",
        "coltype": "show",
        "value": "system.abilities.con.value",
      },

      {
        "name": "INT",
        "type": "direct",
        "coltype": "show",
        "value": "system.abilities.int.value",
      },

      {
        "name": "WIS",
        "type": "direct",
        "coltype": "show",
        "value": "system.abilities.wis.value",
      },

      {
        "name": "CHA",
        "type": "direct",
        "coltype": "show",
        "value": "system.abilities.cha.value",
      },

      {
        "name": "AC",
        "type": "direct",
        "coltype": "show",
        "value": "system.attributes.ac.value",
      },

      {
        "name": "Inv",
        "type": "direct",
        "coltype": "show",
        "value": "system.skills.inv.passive",
      },
      {
        "name": "Vision",
        "type": "string",
        "coltype": "show",
        "value": "",
      },
    ],
    [
      {
        "name": "Classes",
        "type": "array-string-builder",
        "coltype": "show",
        "value": "classes => name - system.levels",
      },
      {
        "name": "",
        "type": "span",
        "coltype": "show",
        "value": "",
      },
      {
        "name": "STR Mod",
        "type": "direct",
        "coltype": "skip",
        "value": "system.abilities.str.mod",
      },
      {
        "name": "DEX Mod",
        "type": "direct",
        "coltype": "skip",
        "value": "system.abilities.dex.mod",
      },
      {
        "name": "CON Mod",
        "type": "direct",
        "coltype": "skip",
        "value": "system.abilities.con.mod",
      },
      {
        "name": "INT Mod",
        "type": "direct",
        "coltype": "skip",
        "value": "system.abilities.int.mod",
      },
      {
        "name": "WIS Mod",
        "type": "direct",
        "coltype": "skip",
        "value": "system.abilities.wis.mod",
      },
      {
        "name": "CHA Mod",
        "type": "direct",
        "coltype": "skip",
        "value": "system.abilities.cha.mod",
      },
      {
        "name": "Per",
        "type": "direct",
        "coltype": "show",
        "value": "system.skills.prc.passive",
      },
      {
        "name": "Ins",
        "type": "direct",
        "coltype": "show",
        "value": "system.skills.ins.passive",
      },
      {
        "name": "Senses",
        "type": "direct-complex",
        "coltype": "skip",
        "value": [
          {
            type: "exists",
            value: "system.attributes.senses.darkvision",
            text: "Darkvision: system.attributes.senses.darkvision",
          },
          {
            type: "exists",
            value: "system.attributes.senses.blindsight",
            text: "Blindsight: system.attributes.senses.blindsight",
          },
          {
            type: "exists",
            value: "system.attributes.senses.tremorsense",
            text: "Tremorsense: system.attributes.senses.tremorsense",
          },
          {
            type: "exists",
            value: "system.attributes.senses.truesight",
            text: "Truesight: system.attributes.senses.truesight",
          },
          {
            type: "exists",
            value: "system.attributes.senses.special",
            text: "Special: system.attributes.senses.special",
          },
        ],
      },
    ],
  ],
};
