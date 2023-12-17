export /** @type {SystemData} */
const twdu = {
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
        "value": "{charactersheet} name {newline} system.archetype",
      },
      {
        "name": "Health",
        "type": "direct",
        "coltype": "show",
        "value": "system.health.value",
      },
      {
        "name": "Stress",
        "type": "direct",
        "coltype": "show",
        "value": "system.stress.value",
      },
      {
        "name": "Strength",
        "type": "direct",
        "coltype": "show",
        "value": "system.attributes.str.value",
      },

      {
        "name": "Agility",
        "type": "direct",
        "coltype": "show",
        "value": "system.attributes.agl.value",
      },

      {
        "name": "Wits",
        "type": "direct",
        "coltype": "show",
        "value": "system.attributes.wit.value",
      },
      {
        "name": "Empathy",
        "type": "direct",
        "coltype": "show",
        "value": "system.attributes.emp.value",
      },
      {
        "name": "Movement",
        "type": "direct",
        "coltype": "show",
        "value": "name system.attributes.emp.value {+} system.attributes.agl.value name",
      },
      {
        "name": "PC Anchor",
        "type": "string",
        "coltype": "show",
        "value": "system.pcAnchor.value",
      },
      {
        "name": "Close Combat",
        "type": "direct",
        "coltype": "show",
        "value": "system.skills.closeCombat.value",
      },
      {
        "name": "Endure",
        "type": "direct",
        "coltype": "show",
        "value": "system.skills.endure.value",
      },
      {
        "name": "Force",
        "type": "direct",
        "coltype": "show",
        "value": "system.skills.force.value",
      },
      {
        "name": "Mobility",
        "type": "direct",
        "coltype": "show",
        "value": "system.skills.mobility.value",
      },
      {
        "name": "Ranged Combat",
        "type": "direct",
        "coltype": "show",
        "value": "system.skills.rangedCombat.value",
      },
      {
        "name": "Stealth",
        "type": "direct",
        "coltype": "show",
        "value": "system.skills.stealth.value",
      },
      {
        "name": "Scout",
        "type": "direct",
        "coltype": "show",
        "value": "system.skills.scout.value",
      },
      {
        "name": "Survival",
        "type": "direct",
        "coltype": "show",
        "value": "system.skills.survival.value",
      },
      {
        "name": "Tech",
        "type": "direct",
        "coltype": "show",
        "value": "system.skills.tech.value",
      },
      {
        "name": "Leadership",
        "type": "direct",
        "coltype": "show",
        "value": "system.skills.leadership.value",
      },
      {
        "name": "Manipulation",
        "type": "direct",
        "coltype": "show",
        "value": "system.skills.manipulation.value",
      },
      {
        "name": "Medicine",
        "type": "direct",
        "coltype": "show",
        "value": "system.skills.medicine.value",
      },
    ],
  ],
};
