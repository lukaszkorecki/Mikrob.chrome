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
    if(blip) {
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
    });
  }
  function createStatus(body) {
    blip.createStatus(body);
  }

  function setUpTimeline() {
    viewport.attachEventListener('click','a.external', function(event){
      console.dir(event.target);
      return false;
    });
  }
  return {
    setUpTimeline : setUpTimeline,
    storeCredentials : storeCredentials,
    getCredentials : getCredentials,
    loadDashboard : loadDashboard,
    updateDashboard : updateDashboard,
    createStatus : createStatus,
    blip : blip
  };
})();
