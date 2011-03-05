window = false; // remove window oobject
importScripts('../lib/platform.js',
    '../lib/template.js',
    '../vendor/mustache.js');

self.onmessage = function(event) {
  var html = new Template(event.data.template_name).render(event.data.obj);
  postMessage(html);
};
