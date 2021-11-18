module.exports = function(minified) {

var MAXSIZE = [50, 50];  

function convertToB64(img, url) {
    var canvas = document.createElement("canvas");
    canvas.width = MAXSIZE[0];
    canvas.height = MAXSIZE[1];

    //img.crossOrigin = "Anonymous";
    img.src = url;
    img.width = MAXSIZE[0];
    img.height = MAXSIZE[1];

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, 50, 50);

    img.src = canvas.toDataURL("image/png");
    img.style = "";

    return true;
}

  var clayConfig = this;
  var _ = minified._;
  var $ = minified.$;
  var HTML = minified.HTML;

clayConfig.on(clayConfig.EVENTS.AFTER_BUILD, function() {


  var addTile = clayConfig.getItemById('AddTile');
  var iconButton = clayConfig.getItemById('IconLoad');
  var submitButton = clayConfig.getItemById('Submit');
  var url = clayConfig.getItemById('icon0');

  var clayJSON = clayConfig.getItemById('ClayJSON');
  var claySubmit = clayConfig.getItemById('ClaySubmit');
  clayJSON.hide();
  clayJSON.set('');
  claySubmit.hide();

  iconButton.on('click', function() {
    var img = document.getElementById('insertIcon');
    if (! convertToB64(img, "https://cors-anywhere.herokuapp.com/" + url.get())) {
      img.style = "display: none;";
      }
    });
  submitButton.on('click', function () {
      var t_json = {"action": "Submit", "inputs": []};
      var items = clayConfig.getAllItems();
      items.forEach(function(item, index) {
        var t_dict = { "id": item.id, "value": item.get() };
        console.log(JSON.stringify(t_dict));
         t_json.inputs.push(t_dict);
       });
      clayJSON.set(JSON.stringify(t_json));
      claySubmit.trigger('submit');
    });

  addTile.on('click', function() {
      //ClayConfig.getAllItems().forEach(function(item, index) {
      //   t_json.inputs.push(item.get());
      // });
      var t_json = {"action": "AddTile"};
      clayJSON.set(JSON.stringify(t_json));
      claySubmit.trigger('submit');
    });
  });
};
    // var xhr = new XMLHttpRequest();
    // var blob;
    // var fileReader = new FileReader();

    // xhr.onload = function () {
    //   var img = document.getElementById('insertIcon');
    //   if (xhr.status === 200) {
    //     blob = new Blob([xhr.response], {type: "image/png"});
    //     fileReader.onload = function(e) {
    //       img.src = e.target.result;
    //       img.style = "";
    //     };

    //     fileReader.readAsDataURL(blob);
    //   }
    //   else if(xhr.status !== 200) {
    //     img.src = "";
    //     img.style = "display: none;";    
    //   }
    // };

    // xhr.responseType = "arraybuffer";
    // xhr.open("GET", "https://cors-anywhere.herokuapp.com/" + url.get(), true);
    // //xhr.open("GET", url.get(), true);
    // xhr.send();

