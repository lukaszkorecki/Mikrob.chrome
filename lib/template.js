var Template = function(name){
  this.template_source = this.load(name);
};
Template.prototype.load = function(name) {
  var page_request = new XMLHttpRequest();
  // Titanium
  var path = "app://sources/templates/"+name+'.mustache';
  if(window.chrome) {
    path = chrome.extension.getURL('templates/'+name+'.mustache');
  }
  page_request.open('GET', path, false);
  page_request.send(null);
  return (page_request.responseText);


};

Template.prototype.render = function(object){
  return Mustache.to_html(this.template_source, object);
};
