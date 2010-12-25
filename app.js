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

  function parseJSON(string) {
    return eval('('+string+')');
  }
  return {
    storeCredentials : storeCredentials,
    getCredentials : getCredentials,
    parseJSON : parseJSON
  };
})();
