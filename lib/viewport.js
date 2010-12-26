var ViewPort = function(view_id) {
  this.view_id = view_id;
  this.template = new Template('blip');
};

ViewPort.prototype.attachEventListener = function(event, selector, listener) {
  $('#'+this.view_id).delegate(event,selector, listener);
};

ViewPort.prototype.renderCollection = function(collection, is_prepend){
  var meth = is_prepend ? 'prepend' : 'append';
  var coll =  is_prepend ? collection.reverse() : collection;
  coll.forEach(function(el){
    var status = new Status(el);
    var html = this.template.render(status);
    $('#'+this.view_id)[meth](html);
  }.bind(this));
};
