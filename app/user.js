var Mikrob= (Mikrob || {});
Mikrob.User = (function(){
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

