var BodyParser = (function() {
  var findLinks = /http(s)*:\/\/[0-9a-z\,\;\_\/\.\-\&\=\?\%]+/gi;

  var findUsers = /\^\w{1,}/g;

  var findTags = /#[a-zA-Z0-9ęóąśłżźćń_\-]{2,}/gi;

  function userLink(body, url) {
    return body.replace(findUsers, function(user){
      var clean = user.replace(/\^/,'');
      return '<a data-action="user" data-username="'+clean+'" href="'+url+clean+'">'+user+'</a>';
    });
  }
  function tagLink(body,  url) {
    return body.replace(findTags, function(tag){
      var clean = tag.replace(/^#/,'');
      return '<a data-action="tag" data-tag="'+clean+'" href="'+url+clean+'">'+tag+'</a>';
    });
  }

  function justLink(body) {
    return body.replace(findLinks, function(link){
        var content = link;
        var action = "link";
        var href = link;
      if (link.match(/blip.pl\/[s|dm|pm]/)) {
        content = "[blip]";
        action = "bliplink";
        href= "#";

      }
      return '<a data-action="'+action+'" href="'+href+'" data-url="'+link+'">'+content+'</a>';
    });
  }

  function parse(body) {
    body = body.replace('&', '&amp;').replace(/\>/gi, '&gt;').replace(/\</gi, '&lt;') ;
    body = justLink(body);
    body = userLink(body, "http://blip.pl/users/");
    body = tagLink(body, "http://blip.pl/tags/");
    return body;
  }
  return {
    userLink : userLink,
    justLink : justLink,
    tagLink : tagLink,
    parse : parse
  };
})();
