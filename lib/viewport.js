// TODO this thing will need to be broken down or sth
var ViewPort = function(view_id) {
  this.view_id = view_id;
  this.status_template = new Template('blip');
  this.notice_template = new Template('notice');
  this.content = $('#'+this.view_id+' .content');

  this.currentUser = Mikrob.Service.blipAcc.username;
};

ViewPort.prototype.attachEventListener = function(event_type, selector, listener) {
  // uses live query :-)
  var s = '#'+this.view_id + ' ' + selector;
  $(s).live(event_type,listener);
};

ViewPort.prototype.renderHTML = function(html, method) {
  this.content[method](html);
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
  var html = "";

  var renderWorker = new Worker('workers/render_collection.js');

  renderWorker.postMessage({ collection : collection, currentUser : this.currentUser });

  renderWorker.addEventListener('message', function(event){
    this.renderHTML(event.data, (is_prepend ? 'prepend' : 'append') );
  }.bind(this));
};

ViewPort.prototype.renderSingle = function(status_obj,is_append) {
    var stat = Status(status_obj, this.currentUser);
    var str = this.templateRender(stat);

    this.renderHTML(str,(is_append ? "append" : "html"));
};


ViewPort.prototype.renderTemplate = function(template_name, obj, is_append){
  var meth = is_append ? 'append' : 'html';
  // load/create template object if the template isn't created already
  if(! this[template_name+'_template']) {
    this[template_name+'_template'] = new Template(template_name);
  }
  this.content[meth](this[template_name+'_template'].render(obj));
};
