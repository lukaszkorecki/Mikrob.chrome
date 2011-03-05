// TODO this thing will need to be broken down or sth
var ViewPort = function(view_id) {
  this.view_id = view_id;
  this.content = $('#'+this.view_id+' .content');

  this.currentUser = Mikrob.Service.blipAcc.username;
};

ViewPort.prototype.attachEventListener = function(event_type, selector, listener) {
  // uses live query :-)
  var s = '#'+this.view_id + ' ' + selector;
  $(s).live(event_type,listener);
};

ViewPort.prototype.renderCollection = function(collection, is_prepend, _mode){
  var html = "",
      mode = _mode || (is_prepend ? 'prepend' : 'append'),
      renderWorker = new Worker('workers/render_collection.js');

  renderWorker.postMessage({ collection : collection, currentUser : this.currentUser });

  renderWorker.addEventListener('message', function(event){
    this.content[mode](event.data);

    renderWorker.terminate();
  }.bind(this));
};

ViewPort.prototype.renderSingle = function(status_obj,is_append) {
  this.renderCollection([ status_obj ], true, (is_append ? "append" : "html"));
};


ViewPort.prototype.renderTemplate = function(template_name, obj, is_append, renderTarget){
  var meth = is_append ? 'append' : 'html',
      renderTemplateWorker = new Worker('workers/render_template.js');

  renderTemplateWorker.postMessage({template_name : template_name, obj : obj});

  renderTemplateWorker.addEventListener('message', function(event){
    // XXX - you can pass any Zepto element, so that anything can get a template
    if(renderTarget) {
      renderTarget.html(event.data);
    } else {
      this.content[meth](event.data);
    }

    renderTemplateWorker.terminate();
  }.bind(this));

};
