# Template System JSON Documentation

Examples can be found in the [example_templates](https://github.com/EddieDover/Theater-of-the-Mind/example_templates) folder.
Place templates in the <FOUNDRY_VTT/Data/totm/> folder.

## Required Top Level Structure

```json
{
  "name": <YOUR_TEMPLATE_NAME>,
  "system": <YOUR_TEMPLATE_SYSTEM>,
  "author": <YOUR_NAME>,
  "rows": [] // See Below Section For Details
}
```

***Note**: Templates will be displayed to the user as 'YOUR_TEMPLATE_NAME - YOUR_NAME' and only if the system matches the current system in use.*

### Row Specific Structure

The "rows" property must contain an array of an array of column data.

``` "rows": [] ``` is empty

``` "rows": [ [] ] ``` will contain one row

``` "rows": "[ [], [] ]``` will contain two rows.

Inside the row array, the plugin expects items in the following format:
```json
{
  "name": <COLUMN_NAME>,
  "type": <DATA_TYPE>,
  "coltype": <COLUMN_TYPE>,
  "value": <DATA_VALUE>
}
```

__Each item corresponds to a single column on the sheet. If you have multiple rows, then each row must have the same number of columns.__ See the below Examples section for more examples.

### Primary Property Specifics

**name** - This can be any value you wish. If the coltype is "show" then it will be displayed as the column header.

**type** - This is the type of data being displayed, possible choices are:
  * **direct** - This will process the text in the **value** property and parse out any string sections to see if they are properties of the character.
  * **direct-complex** - This will expect the **value** property to contain an array of complex types. See documentation below.
  * **string** - This will simply display the text in the **value** property without modification.
  * **array-string-builder** - This will accept a **value** property in the following format: **<array_object> => <sub_property_string>** See examples below for more information
  * **charactersheet** - This will display the character sheet in the column, ignoring anything in the **value** property.

**coltype** - This property controls if the column text is displayed as a header in the generated table. It accepts either 'show' or 'skip'.
  * **show** - Show the column as a **header** column.
  * **skip** - Do NOT Show the column as a **header** column.

**value** - This property is either a **string** or an **array** of objects based on if you're using **direct-complex** or not. See examples below.

### Value - Special Keywords

There are a few special keywords that must be surrounded by { } marks, to allow easier formatting. They are as follows:

  * newline - Adds a linebreak to the text rendered.
  * charactersheet - Inserts a clickable image of the character that will open their character sheet.

### Direct-Complex Object

The direct complex object was originally created to show values for attributes but only if they existed. It was originally used for the DND5E Senses display.

A direct complex object has three properties:
* type - The type of object. At the moment this only supports **exists**, ergo does the value exist or not.
* value - The attribute that you're checking against
* text - The text to be displayed if the **type** check passes. It will be processed in the same manner as the **value** is processed on a standard **direct** column type.

```json
{
  "name": "Senses",
  "type": "direct-complex",
  "coltype": "skip",
  "value": [
    {
      type: "exists",
      value: "system.attributes.senses.darkvision",
      text: "Darkvision: system.attributes.senses.darkvision"
    },
    {
      type: "exists",
      value: "system.attributes.senses.blindsight",
      text: "Blindsight: system.attributes.senses.blindsight"
    },
    {
      type: "exists",
      value: "system.attributes.senses.tremorsense",
      text: "Tremorsense: system.attributes.senses.tremorsense"
    },
    {
      type: "exists",
      value: "system.attributes.senses.truesight",
      text: "Truesight: system.attributes.senses.truesight"
    },
    {
      type: "exists",
      value: "system.attributes.senses.special",
      text: "Special: system.attributes.senses.special"
    }
  ]
}
```

In this example, the system will contain one column named Senses, but the column name will be hidden (skipped). It will then loop through each item in the **value** field. In this case, it will check each of the dnd5e system senses. If they exist on the character, then the text will be displayed, formatted as a **direct** line, and all appended together at the end.

In this example, the following character only has one sense that exists, so it's the only one displayed:

![Example Sense](doc_images/senses1.png)

## Examples

### Extremely Basic File Example
Code:
```json
{
    "name": "Test Person's DND 5E Template",
    "system": "dnd5e",
    "author": "Test Person",
    "rows" : [
        [
            {
                "name": "Name",
                "type": "direct",
                "coltype": "show",
                "value": "{charactersheet} name {newline} system.details.race"
            }
        ]
    ]
}

// Note that this uses both the charactersheet and newline special keywords.
```
Result:

![Basic Example](doc_images/ex1.png)