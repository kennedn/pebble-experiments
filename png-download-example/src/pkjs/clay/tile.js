module.exports = [
  {
  "type": "section",
  "items": [
      {
        "type": "heading",
        "defaultValue": "Tile"
      },
      {
        "type": "input",
        "label": "Url",
        "attributes": {
          "type": "url",
        },
        "id": "{{{index}}}",
        "group": "url"
      },
      {
        "type": "select",
        "label": "Method",
        "defaultValue": "get",
        "options": [
          {"label": "GET", "value": "get"},
          {"label": "POST", "value": "post"},
          {"label": "PUT", "value": "put"},
          {"label": "DELETE", "value": "delete"}
          ],
        "id": "{{{index}}}",
        "group": "method"
      },
      {
        "type": "input",
        "label": "Body",
        "attributes": {
          "type": "text",
        },
        "id": "{{{index}}}",
        "group": "body"
      },
      {
        "type": "color",
        "label": "Primary Background",
        "layout": "COLOR",
        "defaultValue": "00aa00",
        "sunlight": false,
        "id": "{{{index}}}",
        "group": "color1"
      },
      {
        "type": "color",
        "label": "Primary Highlight",
        "layout": "COLOR",
        "defaultValue": "55aa55",
        "sunlight": false,
        "id": "{{{index}}}",
        "group": "color2"
      },
      {
        "type": "color",
        "label": "Secondary Background",
        "layout": "COLOR",
        "defaultValue": "ff0055",
        "sunlight": false,
        "id": "{{{index}}}",
        "group": "color3"
      },
      {
        "type": "color",
        "label": "Secondary Highlight",
        "layout": "COLOR",
        "defaultValue": "ff5555",
        "sunlight": false,
        "id": "{{{index}}}",
        "group": "color4"
      },
      {
        "type": "input",
        "label": "Icon",
        "attributes": {
          "type": "text",
        },
        "description": "<img src='' id='insertIcon' style='display: none;'/>",
        "id": "{{{index}}}",
        "group": "icon"
      },

    ]
  }
];
