var Template = function(name){
  this.template_source = this.load(name);
};
Template.prototype.load = function(name) {
  var page_request = new XMLHttpRequest();
  page_request.open('GET', chrome.extension.getURL('templates/'+name+'.mustache'), false);
  page_request.send(null);
  return (page_request.responseText);

};

Template.prototype.render = function(object){
  return Mustache.to_html(this.template_source, object);
};
