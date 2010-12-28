var ViewPort = function(view_id) {
  this.view_id = view_id;
  this.status_template = new Template('blip');
  this.notice_template = new Template('notice');
};

ViewPort.prototype.attachEventListener = function(event, selector, listener) {
  $('#'+this.view_id).delegate(event,selector, listener);
};
ViewPort.prototype.templateRender = function(status_obj) {
  var out = "";
  switch(status_obj.type) {
    case 'Notice':
      out = this.notice_template.render(status_obj);
      break;

    default:
      out = this.status_template.render(status_obj);
      break;
  }
  return out;
};

ViewPort.prototype.renderCollection = function(collection, is_prepend){
  var meth = is_prepend ? 'prepend' : 'append';
  var coll =  is_prepend ? collection.reverse() : collection;
  var html = "";
  coll.forEach(function(el){
    var status = new Status(el);
    html += this.templateRender(status);
  }.bind(this));
  $('#'+this.view_id)[meth](html);
};
