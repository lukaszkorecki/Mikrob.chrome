window = false; // remove window oobject
importScripts('../lib/platform.js',
    '../lib/status.js',
    '../lib/template.js',
    '../vendor/mustache.js',
    '../lib/body_parser.js');

var statusTemplate = new Template('blip'),
    noticeTemplate = new Template('notice'),
    rendered = {},
    html = '';

function templateRender(statusObj) {
  var out = "EMPTY, STH WENT WRONG";
  switch(statusObj.type) {
    case 'Notice':
      out = noticeTemplate.render(statusObj);
      break;

    default:
      out = statusTemplate.render(statusObj);
      break;
  }
  return out;
}
self.onmessage = function(event) {
  var collection = event.data.collection,
      currentUser = event.data.currentUser;

  collection = collection.sort(function(a,b) { return a.id - b.id; }).reverse();

  collection.forEach(function(el,index){
    var status = Status(el, currentUser);
    if(rendered[el.id] !== true) html += templateRender(status);
    rendered[el.id] = true;
  });
  postMessage(html);
};
