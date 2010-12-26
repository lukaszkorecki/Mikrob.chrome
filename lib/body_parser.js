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
