var Mikrob = (function(){
  function storeCredentials(username, password) {
    localStorage['username'] = username;
    localStorage['password'] = password;
  }
  function getCredentials() {
    var username, password;
    username = localStorage['username'];
    password = localStorage['password'];
    return {
      username : username,
      password : password
    };
  }

  return {
    storeCredentials : storeCredentials,
    getCredentials : getCredentials
  };
})();

var ViewPort = function(view_id) {
  this.view_id = view_id;
  this.template = new Template('blip');
};

ViewPort.prototype.attachEventListener = function(event, selector, listener) {
  $('#'+this.view_id).delegate(event,selector, listener);
};

ViewPort.prototype.renderCollection = function(collection){
  collection.forEach(function(el){
    var status = new Status(el);
    var html = this.template.render(status);
    $('#'+this.view_id).append(html);
  }.bind(this));
};

var BodyParser = (function() {
  var findLinks = /http(s)*:\/\/[0-9a-z\,\;\_\/\.\-\&\=\?\%]+/gi;

  var findUsers = /(\^|\@)\w{1,}/g;

  var findTags = /#[a-zA-Z0-9ęóąśłżźćń_\-]*/gi;

  function userLink(body,   domain) {
    return body;
  }
  function tagLink(body,  domain) {
   return body;
  }
  function justLink(body) {
   return body;
  }

  function attach_special_class(url) {
   // it would be cool to have some ruby here...
   // but we'll do it differently
   var prefix = "special_";
   if(url.match(/wrzuta/gi)) { return prefix+"wrzuta"; }
   if(url.match(/youtube/gi)) { return prefix+"youtube"; }
   if(url.match(/vimeo/gi)) { return prefix+"vimeo"; }
   return "";
  }
  return {
   userLink : userLink,
   justLink : justLink,
   tagLink : tagLink
  };
})();
