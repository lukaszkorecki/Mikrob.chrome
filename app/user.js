var Mikrob= (Mikrob || {});
Mikrob.User = (function(){
  function storeCredentials(access_token, access_token_secret) {
    localStorage['access_token'] = access_token;
    localStorage['access_token_secret'] = access_token_secret;
  }
  function getCredentials() {
    var access_token, access_token_secret;
    access_token = localStorage['access_token'];
    access_token_secret = localStorage['access_token_secret'];
    return {
      access_token : access_token,
      access_token_secret : access_token_secret
    };
  }

  return {
    storeCredentials : storeCredentials,
    getCredentials : getCredentials
  };
})();

