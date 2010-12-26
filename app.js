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
  var cred,blip, last_id;
  var viewport = new ViewPort('timeline');
  cred = getCredentials();
  if(cred.username && cred.password) {
    blip = new Blip(cred.username, cred.password);
  }
  function loadDashboard() {
      blip.getDashboard(false,{
        onSuccess : function(resp) {
          viewport.renderCollection(resp);
          last_id = resp[0].id;
        },
        onFailure : function(resp) {
          console.dir(resp);
        }
      });
  }
  function updateDashboard() {
    blip.getDashboard(last_id, {
        onSuccess : function(resp) {
          if(resp.length > 0) {
            viewport.renderCollection(resp,true);
            last_id = resp[0].id;
          }
        },
        onFailure : function(resp) {
          console.dir(resp);
        }
      } );
  }

  return {
    storeCredentials : storeCredentials,
    getCredentials : getCredentials,
    loadDashboard : loadDashboard,
    updateDashboard : updateDashboard
  };
})();
