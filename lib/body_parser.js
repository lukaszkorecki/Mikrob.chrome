var BodyParser = (function() {
  var findLinks = /http(s)*:\/\/[0-9a-z\,\;\_\/\.\-\&\=\?\%]+/gi;

  var findUsers = /\^\w{1,}/g;

  var findTags = /#[a-zA-Z0-9ęóąśłżźćń_\-]{2,}/gi;

  var findLocations = /\@\/.*?\//gi;

  function statusLocation(body) {
    return body.replace(findLocations,function(loc){
      var extracted_loc = loc.replace(/^\@\//,'').replace(/\/$/,'');
      var location_url = "http://maps.google.com/maps/api/staticmap?center="+encodeURI(extracted_loc)+"&zoom=14&size=350x350&sensor=true&markers=size:small|color:red|"+encodeURI(extracted_loc);

      var tag = ["<span class='pic location'>(Lokacja: <input type='image' src='assets/location_black_16.png' data-action='picture' data-url='",location_url,"' />)</span>"].join('');
      return tag;
    });
  }
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
      if(link.match(/rdir.pl/)) {
        action = 'expand';
      }
      return '<a data-action="'+action+'" href="'+href+'" data-url="'+link+'">'+content+'</a>';
    });
  }

  function parse(body) {
    body = body.replace('&', '&amp;').replace(/\>/gi, '&gt;').replace(/\</gi, '&lt;') ;
    body = justLink(body);
    body = statusLocation(body);
    body = userLink(body, "http://blip.pl/users/");
    body = tagLink(body, "http://blip.pl/tags/");
    return body;
  }
  return {
    userLink : userLink,
    justLink : justLink,
    tagLink : tagLink,
    statusLocation : statusLocation,
    parse : parse
  };
})();
