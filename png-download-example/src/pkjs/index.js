var Clay = require('pebble-clay');
var clayConfig = require('./clay/config');
var customClay = require('./clay/custom-clay');
var tileTemplate = require('./clay/tile');
var messageKeys = require('message_keys');
var baseConfigLength = clayConfig.length;
//add initial tile and generate clay object
var clay;
var tileIdx = 0;
function insertTile(idx) {
  var t_tile = tileTemplate;
  t_tile = JSON.parse(JSON.stringify(t_tile).replace('{{{index}}}', idx));
  clayConfig.splice(clayConfig.length - baseConfigLength, 0, t_tile);
  clay = new Clay(clayConfig, customClay, {autoHandleEvents: false});
}
insertTile(tileIdx);
tileIdx++;

var IMG_URL = 'https://i.imgur.com/vnjaPTo.png';
var MAX_CHUNK_SIZE = 8000;  // From app_message_inbox_size_maximum()

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


  if (clayJSON.action == "AddTile") {
    insertTile(tileIdx);
    tileIdx++;
    Pebble.openURL(clay.generateUrl());
  }
  else if (clayJSON.action == "Submit") {
    // Decode and parse config data as JSON
    var settings = clayJSON.inputs;
    console.log(settings);

    // flatten the settings for localStorage
    var settingsStorage = {};
    settings.forEach(function(e) {
      if (typeof e === 'object' && e.id) {
        settingsStorage[e.id] = e.value;
      } else {
        settingsStorage[e.id] = e;
      }
    });

    console.log('clay-settings', JSON.stringify(settingsStorage));
    localStorage.setItem('clay-settings', JSON.stringify(settingsStorage));
  }
  // Send settings values to watch side
  // Pebble.sendAppMessage(dict, function(e) {
  //   console.log('Sent config data to Pebble');
  // }, function(e) {
  //   console.log('Failed to send config data!');
  //   console.log(JSON.stringify(e));
  // });
});

function sendChunk(array, index, arrayLength) {
  // Determine the next chunk size
  var chunkSize;
  if(arrayLength - index < MAX_CHUNK_SIZE) {
    // Will only need one more chunk
    chunkSize = arrayLength - index;
  } else {
    // Will require multiple chunks for remaining data
    chunkSize = MAX_CHUNK_SIZE;
  }

  // Prepare the dictionary
  var dict = {
    'AppKeyDataChunk': array.slice(index, index + chunkSize),
    'AppKeyChunkSize': chunkSize,
    'AppKeyIndex': index
  };

  // Send the chunk
  Pebble.sendAppMessage(dict, function() {
    // Success
    index += chunkSize;

    if(index < arrayLength) {
      // Send the next chunk
      sendChunk(array, index, arrayLength);
    } else {
      // Complete!
      Pebble.sendAppMessage({'AppKeyComplete': 0});
      if (console.timeEnd) console.timeEnd('Send Image');
    }
  }, function(e) {
    console.log('Failed to send chunk with index ' + index);
  });
}

function transmitImage(array) {
  var index = 0;
  var arrayLength = array.length;
  
  // Transmit the length for array allocation
  Pebble.sendAppMessage({'AppKeyDataLength': arrayLength}, function(e) {
    // Success, begin sending chunks
    sendChunk(array, index, arrayLength);
  }, function(e) {
    console.log('Failed to send data length to Pebble!');
  });
}

function processImage(responseData) {
  // Convert to a array
  var byteArray = new Uint8Array(responseData);
  var array = [];
  for(var i = 0; i < byteArray.byteLength; i++) {
    array.push(byteArray[i]);
  }
  // Send chunks to Pebble
  transmitImage(array);
}

function downloadImage() {
  var request = new XMLHttpRequest();
  request.onload = function() {
    processImage(this.response);
  };
  request.responseType = "arraybuffer";
  request.open("GET", IMG_URL);
  request.send();
}

Pebble.addEventListener('ready', function() {
  if (console.time) console.time('Send Image');
  downloadImage();
  console.log("ready");
});
