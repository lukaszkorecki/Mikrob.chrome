// TODO this thing will need to be broken down or sth
var ViewPort = function(view_id) {
  this.view_id = view_id;
  this.status_template = new Template('blip');
  this.notice_template = new Template('notice');
  this.quoted_template = new Template('quoted');
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
  var html = "";

  collection.forEach(function(el,index){
    var status = new Status(el);
    // check whether we have renedered that thing before
    if(($('div[data-blipid="'+el.id+'"]').get().length === 0)) {
      html += this.templateRender(status);
      if(index < 6 && is_prepend) {
        Mikrob.Notification.create(status.username,status.orig_body,status.user_avatar_url);
      }
    }
    // notify about last 5 and only on update
  }.bind(this));
  $('#'+this.view_id)[meth](html);
};

ViewPort.prototype.renderSingle = function(status_obj,is_append) {
    var stat = new Status(status_obj);
    var str = this.templateRender(stat);
    var meth = is_append ? "append" : "html";
    $('#'+this.view_id)[meth](str);

};

ViewPort.prototype.renderHTML = function(html, is_append) {
  var meth = is_append ? 'append' : 'html';
  $('#'+this.view_id)[meth](html);
};

ViewPort.prototype.renderTemplate = function(template_name, obj, is_append){
  var meth = is_append ? 'append' : 'html';
  // load/create template object if the template isn't created already
  if(! this[template_name+'_template']) {
    this[template_name+'_template'] = new Template(template_name);
  }
  $('#'+this.view_id)[meth](this[template_name+'_template'].render(obj));
};
