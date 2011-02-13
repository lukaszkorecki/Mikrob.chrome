var Mikrob = (Mikrob || {});
Mikrob.Service = (function(){
  var blipAcc,blipi, last_id;

  function loadDashboard(blip,viewport, callbackAfter) {
    this.blipAcc = blip;
    this.blipAcc.getDashboard(false,{
      onSuccess : function(resp) {
        if(resp.length > 0) {
          resp.forEach(function(stat){ App.statusStore.store(stat.id, stat); });
          Mikrob.Controller.renderDashboard(resp, false);
          last_id = resp[0].id;
          callbackAfter();
        }
      },
      onFailure : function(resp) {
        Mikrob.Notification.create("Błąd", 'Wystąpił błąd podczas ładowania kokpitu');
        console.dir(resp);
      }
    });
  }

  function getBlipi(apiKey) {
    this.blipi = new BlipiApi(apiKey);
  }

  function updateDashboard(viewport) {
    Mikrob.Controller.throbberShow();

    this.blipAcc.getDashboard(last_id, {
      onSuccess : function(resp) {
        if(resp.length > 0) {
          // cache
          resp.forEach(function(stat){ App.statusStore.store(stat.id, stat); });

          Mikrob.Controller.renderDashboard(resp,true);
          last_id = resp[0].id;
          Mikrob.Controller.throbberHide();
        }
      },
      onFailure : function(resp) {
        Mikrob.Notification.create("Błąd", 'Wystąpił błąd podczas pobierania kokpitu');
        console.dir(resp);
        Mikrob.Controller.throbberHide();
      }
    });
  }

  function createStatus(body, file, callbacks) {
    this.blipAcc.createStatus(body,file, callbacks);
  }
  function getSingleStatus(id,callbacks) {
    var single = App.statusStore.get(id);
    if(single) {
      callbacks.onSuccess(single);
    } else {
      this.blipAcc.getStatus(id, callbacks);
    }
  }

  function getUserInfo(username,callbacks) {
    // FIXME no caching yet!
    this.blipAcc.userInfo(username, callbacks);
  }

  function getGeoLocation() {
    navigator.geolocation.getCurrentPosition(function(geo){
      // blip style geo
      var str = ["@/", geo.coords.latitude, ',', geo.coords.longitude, '/'].join('');
      Mikrob.Controller.throbberHide();
      Mikrob.Controller.setContents(str,false, true);

    });

  }

  function followUser(username) {
    this.blipAcc.follow(username, {
      onSuccess : function() {
                    Mikrob.Notification.create('Mikrob', ['Dodano', username, 'do obserwowanych'].join(' '));
                  },
    onFailure : function() {
                    Mikrob.Notification.create('Mikrob', 'Błąd dodawania do obserwowanych');
                }
    });
  }

  function unfollowUser(username) {
    this.blipAcc.unfollow(username, {
      onSuccess : function() {
                    Mikrob.Notification.create('Mikrob', ['Usunięto', username, 'z obserwowanych'].join(' '));
                  },
    onFailure : function() {
                    Mikrob.Notification.create('Mikrob', 'Błąd usuwania z obserwowanych');
                }
    });
  }

  function processThread(discussion) {

    function convertToStatus(_id, object) {
      console.dir(object);
      var username = object.user.split("/").reverse()[0];
      return {
        body : object.content,
        created_at : object.create_date,
        id : _id,
        user : {
          login : username,
          avatar : {
            url_50 : ('/users/'+username+'/avatar/pico.jpg')
          }
        }
      };
    }

    var list = [], res = [];
    for(var id in discussion) {
      list.push(id);
    }
    list.sort().forEach(function(id){
      var o = convertToStatus(id, discussion[id]);
      res.push(o);
    });

    console.dir(res);
    return res;
  }

  function getThread(id) {
    Mikrob.Notification.create('', 'Pobieram dyskusję');
    this.blipi.getThread(id,{
      onSuccess : function(resp) {
                    console.dir(resp);
                    if(resp[0].discussion && resp[0].discussion.length !== 0) {
                      var obj = resp[0].discussion;
                      Mikrob.Controller.renderThread(processThread(obj));
                    } else {
                      Mikrob.Notification.create('Mikrob', 'Pusto!');
                    }
                  },
      onFailure : function(resp) {
                    Mikrob.Notification.create('Mikrob', 'Nie mogę pobrać dyskusji!');
                  }
    });
  }

  return {
    blipAcc : blipAcc,
    blipi : blipi,
    loadDashboard : loadDashboard,
    updateDashboard : updateDashboard,
    createStatus : createStatus,
    getSingleStatus : getSingleStatus,
    getUserInfo : getUserInfo,
    getGeoLocation : getGeoLocation,
    followUser : followUser,
    unfollowUser : unfollowUser,
    getBlipi : getBlipi,
    getThread : getThread
  };
})();
