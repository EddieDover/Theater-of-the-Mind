export /** @type {SystemData} */
const dragonbane = {
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
        "value": "{charactersheet} name {newline} system.kin",
      },
      {
        "name": "Age",
        "type": "direct",
        "coltype": "show",
        "value": "system.age",
      },
      {
        "name": "Profession",
        "type": "direct",
        "coltype": "show",
        "value": "system.profession",
      },
      {
        "name": "HP",
        "type": "direct",
        "coltype": "show",
        "value": "system.hitPoints.value",
      },
      {
        "name": "WP",
        "type": "direct",
        "coltype": "show",
        "value": "system.willPoints.value",
      },
      {
        "name": "STR",
        "type": "direct",
        "coltype": "show",
        "value": "system.attributes.str.value",
      },
      {
        "name": "CON",
        "type": "direct",
        "coltype": "show",
        "value": "system.attributes.con.value",
      },

      {
        "name": "AGL",
        "type": "direct",
        "coltype": "show",
        "value": "system.attributes.agl.value",
      },
      {
        "name": "INT",
        "type": "direct",
        "coltype": "show",
        "value": "system.attributes.int.value",
      },

      {
        "name": "WIL",
        "type": "direct",
        "coltype": "show",
        "value": "system.attributes.wis",
      },

      {
        "name": "CHA",
        "type": "direct",
        "coltype": "show",
        "value": "system.attributes.cha.value",
      },
      {
        "name": "Movement",
        "type": "direct",
        "coltype": "show",
        "value": "system.movement",
      },
      {
        "name": "DB - AGL",
        "type": "direct",
        "coltype": "show",
        "value": "system.damageBonus.agl",
      },
      {
        "name": "DB - STR",
        "type": "direct",
        "coltype": "show",
        "value": "system.damageBonus.str",
      },
      {
        "name": "Copper",
        "type": "direct",
        "coltype": "show",
        "value": "system.currency.cc",
      },
      {
        "name": "Silver",
        "type": "direct",
        "coltype": "show",
        "value": "system.currency.sc",
      },
      {
        "name": "Gold",
        "type": "direct",
        "coltype": "show",
        "value": "system.currency.gc",
      },
    ],
  ],
};
