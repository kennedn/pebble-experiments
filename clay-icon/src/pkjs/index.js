//kennedn/clay#hack/Retrieve-item-value-by-Id
var Clay = require('pebble-clay');
var clayConfig = require('./clay/config');
var customClay = require('./clay/custom-clay');
var iconTemplate = require('./clay/icon');
var messageKeys = require('message_keys');
var baseConfigLength = clayConfig.length;
// var Promise = require('promise');
var Promise = require('bluebird');
// var Promise = require('promise-polyfill').default;
var bufferToString = require('base64-arraybuffer');
//add initial tile and generate clay object
var clay;
var tileIdx = 0;


/**
 * Validate that buffer is an indexed PNG and does not exceed bounds (maxWidth, maxHeight)
 * @param {ArrayBuffer} buffer - Data array generated from an XHR image request
 * @param {int} maxWidth - Maximum width, if image width exceed this value it is rejected
 * @param {int} maxHeight - Maximum height, if image height exceed this value it is rejected
 * @return {boolean} 
 */
function validatePNG(buffer, maxWidth, maxHeight) {
  // Need a DataView so we can read values in big endian
  var bytes = new DataView(buffer);
  /* Check file signature matches PNG standard
   * 2303741511 = '\x89PNG'
   * 218765834  = '\r\n\x1a\n' */
  if (bytes.getUint32(0, false) !== 2303741511 || bytes.getUint32(4, false) !== 218765834) {
    console.error("File signature doesn't match PNG");
    return false;
  }
  /* Check if image header is W3C complient (IHDR)
   * 1229472850 = 'IHDR' */
  if (bytes.getUint32(12, false) !== 1229472850) {
    console.error("PNG does not contain valid header");
    return false;
  }
  /* Validate PNG type, from SDK documentation:
   * PNG decoding supports 1,2,4 and 8 bit palettized and grayscale images. 
   * However grayscale images are rejected by GBitmap, just check if type 3 (palette)*/ 
  var colorType = bytes.getUint8(25, false);
  if (colorType != 3) {
    console.error("PNG type is not indexed (type 3), got type " + colorType);
    return false;
  }
  // Check if we exceed the thresholds for either width or height 
  var width = bytes.getUint32(16, false);
  var height = bytes.getUint32(20, false);
  if (width > maxWidth || height > maxHeight) { 
    console.error("Dimensions exceed " + maxWidth +"x" + maxHeight + ", got " + width +"x" + height);
    return false;
  }
  // All checks passed, valid PNG.
  return true;
}

/**
 * Convert a HTTP PNG url to a data URI
 * @param {string} url - HTTP url for PNG image
 * @return {
 Promise} 
 *   @param {string} resolve - data URI of PNG
 *   @param {string} reject - error message
 */
function convertToB64(url) {
  //Return a promise, we will return data URI to callbacks once complete
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      // If we got a success code
      if (xhr.status === 200) {
        // Make sure the arraybuffer meets our PNG requirements,
        //(type = PNG, width & height <= 75)
        if (validatePNG(xhr.response, 18, 18))
          //return a b64 encoded data URI
          resolve("data:image/png;base64," + bufferToString.encode(xhr.response));
        else
          //return an error
          reject("Image must be an indexed PNG with maximum dimensions of 75x75.");
      }
      //if we got another code
      else if(xhr.status !== 200) {
        //return an error
        reject("Error in download, request returned " + xhr.status);
      }
    };
    //Start HTTP GET request for the image url
    xhr.responseType = "arraybuffer";
    xhr.open("GET", url, true);
    xhr.send();
  });
}

/**
 * Helper function that inserts <img/> tag with data into ClayConfig
 * @param {string} url - HTTP url for PNG image
 * @return {Promise} 
 *   @param {} resolve - NULL
 *   @param {} reject - NULL
 */
function insertDataURL(url) {
  return new Promise(function(resolve, reject) {
    convertToB64(url).then(function(response) {
      clayConfig[0][0].items[1].options.push({"label": "<img id='ValidateIcon' src='" + response + "' />"});
      clay = new Clay(clayConfig, customClay, {autoHandleEvents: false});
      resolve();
    }, function(response) {
      clayConfig[0][0].items[1].options.push({"label": response});
      clay = new Clay(clayConfig, customClay, {autoHandleEvents: false});
      reject();
    });
  });
}

function insertTile(idx) {
  
  var t_tile = JSON.parse(JSON.stringify(iconTemplate));
  t_tile = JSON.stringify(t_tile);
  t_tile = t_tile.replace(/{{{index}}}/g, idx);
  t_tile = JSON.parse(t_tile);
  //console.log(JSON.stringify(t_tile));
  clayConfig.splice(clayConfig.length - baseConfigLength, 0, t_tile);
  clay = new Clay(clayConfig, customClay, {autoHandleEvents: false});
}
insertTile(tileIdx);
tileIdx++;

Pebble.addEventListener('showConfiguration', function(e) {
  Pebble.openURL(clay.generateUrl());
});

Pebble.addEventListener('webviewclosed', function(e) {
  if (e && !e.response) {
    return;
  }
  // Get the keys and values from each config item
  var dict = clay.getSettings(e.response);
  var clayJSON = JSON.parse(dict[messageKeys.ClayJSON]);
  console.log(JSON.stringify(clayJSON));

  switch(clayJSON.action) {
    case "AddTile":
      insertTile(tileIdx);
      tileIdx++;
      Pebble.openURL(clay.generateUrl());
      break;
    case "LoadIcon":
      //Attempt a clayConfig data URI insert with provided payload (url)
      //Re-open config page when promise returns.
      insertDataURL(clayJSON.payload).then(function () {
          console.log("Image parse Success, Re-opening pebbleURL");
          Pebble.openURL(clay.generateUrl());
        },function () {
          console.log("Image parse Failure, Re-opening pebbleURL");
          Pebble.openURL(clay.generateUrl());
        });
      break;
    case "Submit":
      // Decode and parse config data as JSON
      var settings = clayJSON.payload;
      console.log(JSON.stringify(settings));

      // flatten the settings for localStorage
      var settingsStorage = {};
      settings.forEach(function(e) {
        if (typeof e === 'object' && e.id) {
          settingsStorage[e.id] = e.value;
        } else {
          settingsStorage[e.id] = e;
        }
      });
      localStorage.setItem('clay-settings', JSON.stringify(settingsStorage));
      console.log(JSON.stringify(settingsStorage));

      break;
  }
});


Pebble.addEventListener('ready', function() {
  //if (console.time) console.time('Send Image');
  //downloadImage();
  console.log("ready");
});
