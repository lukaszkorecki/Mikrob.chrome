var OAuthRequest = function(config) {

  this.apiRoot = config.apiRoot;
  this.urlConf = config.urlConf;

  this.consumer = {
    consumerKey : config.consumerKey,
    consumerSecret : config.consumerSecret
  };

  this.oauth = OAuth(this.consumer);

  this.requestParams = "";
};

OAuthRequest.prototype.setAccessTokens = function (oauthToken, oauthTokenSecret) {
  this.oauth.setAccessToken([oauthToken, oauthTokenSecret]);
};

OAuthRequest.prototype.requestAuth = function() {
  var fail = function(data) { console.error('fail'); console.dir(data);};

  this.oauth.get(this.urlConf.root+this.urlConf.request_token, function(data){
        if(data && data.text) {
            Platform.openURL(this.urlConf.root +this.urlConf.authorize + "?"+ data.text);
          this.requestParams = data.text;
        } else {
          fail(data);
        }

      }.bind(this),fail);
};

// get the oauth_token and oauth_token_secret from the response
OAuthRequest.prototype.secretAndToken = function (str) {
  var r = {};

  str.split("&").forEach(function(data){
    var pairs = data.split("=");
    r[pairs[0]] = pairs[1];
  });

  return r;
};

OAuthRequest.prototype.userAuthorize = function (pin, callbacks) {
  var fail = function(data) { console.error('fail'); console.dir(data); callbacks.onFailure();};

  this.oauth.get(this.urlConf.root +this.urlConf.access_token + "?oauth_verifier="+pin+"&"+this.requestParams,
      function(data){
        var importantStuff = this.secretAndToken(data.text);
        this.setAccessTokens(importantStuff.oauth_token, importantStuff.oauth_token_secret);
        callbacks.onSuccess(importantStuff);
      }.bind(this),fail);
};


OAuthRequest.prototype.get = function(url, callbacks) {
  this.oauth.get(url, callbacks.onSuccess, callbacks.onFailure);
};

OAuthRequest.prototype.post = function(url, data, callbacks) {
  this.oauth.post(url,data, callbacks.onSuccess, callbacks.onFailure);
};

OAuthRequest.prototype.postWithFile = function(url, data, callbacks) {
  this.oauth.postWithFile(url,data, callbacks.onSuccess, callbacks.onFailure);
};
