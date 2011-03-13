var BOauth = (function(){
  // settings
  var op = { consumerKey : BlipOAuthData.key, consumerSecret : BlipOAuthData.secret },
    params = '',
    importantStuff = [];

  // create the oauth endpoint
  var oauth = OAuth(op);

  // request authorization from the user
  function requestAuth() {
    // request the PIN:
    oauth.get(BlipOAuthData.url.root + BlipOAuthData.url.request_token, function(data) {
      // opens a new tab in Chrome
      // or a new window in Titanium Desktop
      // or just plain window.open will work
      // your implementation may vary
      Platform.openURL(BlipOAuthData.url.root +BlipOAuthData.url.authorize + "?"+ data.text);
      params = data.text;
    });

  }

  // get the pin by using prompt
  function userApproves(_pin) {
    var pin = _pin || parseInt(window.prompt('PIN PIN PIN PING'),10);
    getAccess(pin);

  }

  // user authorized our application
  // it's time to notify the provider about this
  // and get the secret sauce
  function getAccess(pin) {

    oauth.get(BlipOAuthData.url.root + BlipOAuthData.url.access_token + "?oauth_verifier="+pin+"&"+params, function(data){
      console.dir(data);

      importantStuff = secretAndToken(data.text);
      oauth.setAccessToken([importantStuff.oauth_token, importantStuff.oauth_token_secret]);
    });

  }


  // get the oauth_token and oauth_token_secret from the response
  function secretAndToken(str) {
    var s = str.split("&"),
        r = {};
    s.forEach(function(data){
      var pairs = data.split("=");
      r[pairs[0]] = pairs[1];
    });

    return r;
  }

  return {
    oauth : oauth,
      requestAuth : requestAuth,
      userApproves : userApproves

  };
})();
