var OAuthRequest = function(config) {
  this.consumerKey = config.consumerKey;
  this.consumerSecret = config.consumerSecret;

  this.apiRoot = config.apiRoot;
  this.urlConf = config.urlConf;

  this.oauth = OAuth({ consumerKey : config.consumerKey, consumerSecret : config.consumerKey});
  this.requestParams = "";
};

OAuthRequest.prototype.setAccessTokens = function (oauthToken, oauthTokenSecret) {
  this.oauth.setAccessToken([oauthToken, oauthTokenSecret]);
};

OAuthRequest.prototype.requestAuth = function() {
  var fail = function(data) { console.error('fail'); console.dir(data);};
  this.oauth.get(this.urlConf.root+this.urlConf.request_token,
      function(data){
        if(data && data.text) {
          Platform.openURL(this.urlConf.root +this.urlConf.authorize + "?"+ data.text);
          this.requestParams = data.text;
        } else {
          fail(data);
        }

      }.bind(this),
      function(data){
        fail(data);
      });
};

// get the oauth_token and oauth_token_secret from the response
OAuthRequest.prototype.secretAndToken = function (str) {
  var s = str.split("&"),
      r = {};

  s.forEach(function(data){
    var pairs = data.split("=");
    r[pairs[0]] = pairs[1];
  });

  return r;
};

OAuthRequest.prototype.userAuthorize = function (pin) {
  this.oauth.get(this.urlConf.root +this.urlConf.access_token + "?oauth_verifier="+pin+"&"+this.requestParams,
      function(data){
        console.dir(data);

        importantStuff = this.secretAndToken(data.text);
        this.setAccessTokens(importantStuff.oauth_token, importantStuff.oauth_token_secret);
      }.bind(this),
      function(data) { console.dir(data); }
      );
};


OAuthRequest.prototype.get = function(path, callbacks) {
  this.oauth.get(this.apiRoot+path, callbacks.onSuccess, callbacks.onFailure);
};

OAuthRequest.prototype.post = function(path, data, callbacks) {
  this.oauth.post(this.apiRoot+path,data, callbacks.onSuccess, callbacks.onFailure);
};
