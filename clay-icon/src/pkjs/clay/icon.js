//https://s3-eu-west-1.amazonaws.com/zippi.bucket.artist/janetdavies/Dancing-Mouse-69256/original_web_0nly.png
module.exports = [
  {
  "type": "section",
  "items": [
      {
        "type": "heading",
        "defaultValue": "Icons"
      },
      {
        "type": "radiogroup",
        "label": "Icons",
        "defaultValue": "get",
        "options": [
          {"label": "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE...' />",
          "value": "get"}
          ],
        "id": "{{{index}}}_icons",
        "group": "icons"
      },
      {
        "type": "input",
        "defaultValue": "https://i.imgur.com/Bwvvn3P.png",
        "label": "Add custom icon from URL:",
        "attributes": {
          "type": "url",
        },
        "id": "{{{index}}}_iurl",
        "group": "iurl"
      },

    ]
  }
];
