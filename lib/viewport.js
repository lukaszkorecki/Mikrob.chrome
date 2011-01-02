var ViewPort = function(view_id) {
  this.view_id = view_id;
  this.status_template = new Template('blip');
  this.notice_template = new Template('notice');
};

ViewPort.prototype.attachEventListener = function(event_type, selector, listener) {
  // uses live query :-)
  var s = '#'+this.view_id + ' ' + selector;
  $(s).live(event_type,listener);
};

// XXX - should this be here?
ViewPort.prototype.templateRender = function(status_obj) {
  var out = "EMPTY, STH WENT WRONG";
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
  coll.forEach(function(el,index){
    var status = new Status(el);
    html += this.templateRender(status);
    // notify about last 5 and only on update
    if(index < 6 && is_prepend) {
      Mikrob.Notification.create(status.username,status.orig_body,status.user_avatar_url);
    }
  }.bind(this));
  $('#'+this.view_id)[meth](html);
};
