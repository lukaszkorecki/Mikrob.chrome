var BodyParser = (function() {
  var findLinks = /http(s)*:\/\/[0-9a-z\,\;\_\/\.\-\&\=\?\%]+/gi;

  var findUsers = /\^\w{1,}/g;

  var findTags = /#[a-zA-Z0-9ęóąśłżźćń_\-]*/gi;

  function userLink(body, url) {
    var words = body.split(findUsers);
    var users = body.match(findUsers);
    var processed_users = users.map(function(user){
      var clean = user.replace(/\^/,'');
      return '<a data-user="'+clean+'" href="'+url+clean+'">'+user+'</a>';
    });
    return merge(words,processed_users);
  }
  function tagLink(body,  url) {
    var words = body.split(findTags);
    var tags = body.match(findTags);
    var processed_tags = tags.map(function(tag){
      var clean = tag.replace(/^#/,'');
      return '<a data-tag="'+clean+'" href="'+url+clean+'">'+tag+'</a>';
    });
    return merge(words,processed_tags);
  }

  function justLink(body) {
    var words = body.split(findLinks);
    var links = body.match(findLinks);
    var processed_links = links.map(function(link){
      return '<a class="external" href="'+link+'">'+link+'</a>';
    });
    return merge(words,processed_links);
  }


  // helper function
  function merge(words, processed) {
    var new_body = "";
    for(var i=0, l = words.length;i<l;i++) {
      if(words[i]) {
        new_body += words[i];
      }
      if(processed[i]) {
        new_body += processed[i];
      }
    }
   return new_body;
  }
  return {
   userLink : userLink,
   justLink : justLink,
   tagLink : tagLink
  };
})();
