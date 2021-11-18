module.exports = function(minified) {

  var clayConfig = this;
  var _ = minified._;
  var $ = minified.$;
  var HTML = minified.HTML;

clayConfig.on(clayConfig.EVENTS.AFTER_BUILD, function() {


  var addTile = clayConfig.getItemById('AddTile');
  var iconButton = clayConfig.getItemById('IconLoad');
  var submitButton = clayConfig.getItemById('Submit');

  var clayJSON = clayConfig.getItemById('ClayJSON');
  var claySubmit = clayConfig.getItemById('ClaySubmit');
  clayJSON.hide();
  clayJSON.set('');
  claySubmit.hide();

  iconButton.on('click', function() {
    var t_json = {"action": "LoadIcon", "payload": clayConfig.getItemById('0_iurl').get()};
    clayJSON.set(JSON.stringify(t_json));
    claySubmit.trigger('submit');
    });
  addTile.on('click', function() {
      var t_json = {"action": "AddTile"};
      clayJSON.set(JSON.stringify(t_json));
      claySubmit.trigger('submit');
    });
  submitButton.on('click', function () {
      var t_json = {"action": "Submit", "payload": []};
      var items = clayConfig.getAllItems();
      items.forEach(function(item, index) {
        var t_dict = { "id": item.id, "value": item.get() };
        console.log(JSON.stringify(t_dict));
         t_json.payload.push(t_dict);
       });
      clayJSON.set(JSON.stringify(t_json));
      claySubmit.trigger('submit');
    });
  });
};

