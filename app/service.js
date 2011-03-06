var Mikrob = (Mikrob || {});
Mikrob.Service = (function(){
  var blipAcc,blipi, last_id, load_attempt=0;

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
                    load_attempt = 0;
                  },
      onFailure : function(resp) {
                    if(load_attempt < 6) Mikrob.Notification.create("Błąd", 'Wystąpił błąd podczas ładowania kokpitu');
                    load_attempt += 1;
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
                      load_attempt = 0;
                    }
                  },
      onFailure : function(resp) {
                    if(load_attempt < 6) {
                      Mikrob.Notification.create("Błąd", 'Wystąpił błąd podczas pobierania kokpitu');
                      Mikrob.Controller.throbberHide();
                    }
                    load_attempt += 1;
                    console.dir(resp);
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

  function processThread(obj) {


    function userObject(name) {
      if(name) {
        return {
          login : name,
                avatar : {
                  url_50 : ('/users/'+name+'/avatar/pico.jpg')
                }
        };
      } else {
        return false;
      }
    }
    function convertToStatus(_id, object) {
      var username = object.user.split("/").reverse()[0];
      var recipient = false;
      if (object.recipient) {
        recipient = object.recipient.split("/").reverse()[0];
      }
      return {
        body : object.content,
             created_at : object.create_date,
             id : _id,
             user : userObject(username),
             recipient : userObject(recipient)
      };
    }

    var discussion = obj.discussion;
    discussion[obj.blipid] = {
      content : obj.content,
      create_date : obj.create_date,
      user : obj.user,
      recipient : obj.recipient
    };

    var list = [], res = [];
    for(var id in discussion) {
      list.push(id);
    }
    list.sort().forEach(function(id){
      var o = convertToStatus(id, discussion[id]);
      res.push(o);
    });

    return res;
  }

  function getThread(id) {
    Mikrob.Notification.create('', 'Pobieram dyskusję');
    this.blipi.getThread(id,{
      onSuccess : function(resp) {
                    if(resp.length > 0 && resp[0].discussion && resp[0].discussion.length !== 0) {
                      Mikrob.Controller.renderThread(processThread(resp[0]));
                    } else {
                      Mikrob.Notification.create('Mikrob', 'Pusto!');
                    }
                  },
      onFailure : function(resp) {
                    Mikrob.Notification.create('Mikrob', 'Nie mogę pobrać dyskusji!');
                  }
    });
  }

  function getTag(tag) {
    Mikrob.Notification.create('', 'Pobieram statusy z tagu: #'+tag);
    this.blipAcc.tag(tag, false,{
      onSuccess : function(resp) {
                    if(resp.length > 0) {
                      Mikrob.Controller.renderTag(tag,resp);
                    }
                  },
      onFailure : function(resp) {
                    console.dir(resp);
                    Mikrob.Notification.create('', 'Problem z pobraniem statusów z tagu: #'+tag);
                  }
    });
  }

  function tagAction(action, tag) {
    var fail = function() { Mikrob.Notification.create('', 'Problem z działaniem na tag\'u #'+tag); };
    var callbacksSub = {
      onSuccess : function() {
                    Mikrob.Notification.create('', 'Zasubskrybowano tag #'+tag);
                  },
      onFailure : fail
    };

    var callbacksNone = {
      onSuccess : function() {
                    Mikrob.Notification.create('', 'Usunięto subskrybcję tagu #'+tag);
                  },
      onFailure : fail
    };
    switch(action) {
      case 'all':
        this.blipAcc.tagSubscribeAll(tag,callbacksSub);
        break;
      case 'tracked':
        this.blipAcc.tagSubscribeTracked(tag,callbacksSub);
        break;
      case 'none':
        this.blipAcc.tagIgnore(tag,callbacksNone);
        break;

      default:
        break;
    }
  }

  function deleteStatus(id) {
    this.blipAcc.remove(id,{
      onSuccess : function() {
                    Mikrob.Controller.removeStatus(id);
                  },
    onFailure : function() {
                  Mikrob.Notification.create('Mikrob', 'Nie udało się usunąć statusu!');
                }
    });
  }

  return {
    blipAcc : blipAcc,
    blipi : blipi,
    loadDashboard : loadDashboard,
    updateDashboard : updateDashboard,
    createStatus : createStatus,
    deleteStatus : deleteStatus,
    getSingleStatus : getSingleStatus,
    getUserInfo : getUserInfo,
    getGeoLocation : getGeoLocation,
    followUser : followUser,
    unfollowUser : unfollowUser,
    getBlipi : getBlipi,
    getThread : getThread,
    getTag : getTag,
    tagAction : tagAction
  };
})();
