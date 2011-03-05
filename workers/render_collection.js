window = false; // remove window oobject
importScripts('../lib/platform.js',
    '../lib/status.js',
    '../lib/template.js',
    '../vendor/mustache.js',
    '../lib/body_parser.js');

var statusTemplate = new Template('blip'),
    noticeTemplate = new Template('notice'),
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

  collection.forEach(function(el,index){
    var status = Status(el, currentUser);
    html += templateRender(status);
  });
  postMessage(html);
};
