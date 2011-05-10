var Mikrob = (Mikrob || {});
Mikrob.Service = (function(){
  var blipAcc,blipi, last_id, embedly = new Embedly(), load_attempt=0, username;

  var OAuthReq = new OAuthRequest({
    consumerKey : BlipOAuthData.key,
    consumerSecret : BlipOAuthData.secret,
    urlConf : BlipOAuthData.url
  });

  function loadDashboard( callbackAfter) {
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
                    if(load_attempt < 2) Mikrob.Notification.create("Mikrob", 'Nie mogę załadować kokpitu!');
                    load_attempt += 1;
                    console.dir(resp);
                  }
    });
  }

  function getBlipi(apiKey) {
    this.blipi = new BlipiApi(apiKey);
  }

  function updateDashboard() {

    this.blipAcc.getDashboard(last_id, {
      onSuccess : function(resp) {
                    if(resp.length > 0) {
                      // cache
                      resp.forEach(function(stat){ App.statusStore.store(stat.id, stat); });

                      Mikrob.Controller.renderDashboard(resp,true);
                      last_id = resp[0].id;
                      load_attempt = 0;
                    }
                  },
      onFailure : function(resp) {
                    if(load_attempt < 6) {
                      Mikrob.Notification.create("Mikrob", 'Wystąpił błąd podczas pobierania kokpitu');
                    } else {
                      Mikrob.Controller.offlineMode();
                      Settings.check.canPoll = false;
                      load_attempt = 0;
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

  function getCurrentUsername(blip,after) {
    this.blipAcc = blip;
    this.blipAcc.getCurrentUsername({
      onSuccess : function(resp) {
                    this.username = resp[0].user.login;
                    after();
                  }.bind(this),
      onFailure : function(resp) {
                    console.dir(resp);
                  }
    });
  }

  function getUserInfo(username,callbacks) {
    // FIXME no caching yet!
    this.blipAcc.userInfo(username, callbacks);
  }

  function getGeoLocation() {
    navigator.geolocation.getCurrentPosition(function(geo){
      // blip style geo
      var str = ["@/", geo.coords.latitude, ',', geo.coords.longitude, '/'].join('');
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

  function ignoreUser(username) {
    this.blipAcc.ignore(username, {
      onSuccess : function() {
                    Mikrob.Notification.create('Mikrob', ['Dodano', username, 'do ignorowanych'].join(' '));
                  },
    onFailure : function() {
                  Mikrob.Notification.create('Mikrob', 'Błąd dodawania do ignorowanych');
                }
    });
  }

  function unignoreUser(username) {
    this.blipAcc.unignore(username, {
      onSuccess : function() {
                    Mikrob.Notification.create('Mikrob', ['Usunięto', username, 'z ignorowanych'].join(' '));
                  },
    onFailure : function() {
                  Mikrob.Notification.create('Mikrob', 'Błąd usuwania z ignorowanych');
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

  function normalizePolishChars(string) {
    var charMap = {
      'ą' : 'a',
      'ż' : 'z',
      'ź' : 'z',
      'ń' : 'n',
      'ó' : 'o',
      'ę' : 'e',
      'ć' : 'c',
      'ł' : 'l'
    };

    var normalized_string = string;

    for(var letter in charMap) {
      normalized_string = normalized_string.replace(letter, charMap[letter]);
    }
    return normalized_string;
  }

  function getTag(tag) {

    this.blipAcc.tag(NormalizePolishChars(tag), false,{
      onSuccess : function(resp) {
                    if(resp.length > 0) {
                      Mikrob.Controller.renderTag(tag,resp);
                    }
                  },
      onFailure : function(resp) {
                    console.dir(resp);
                    Mikrob.Notification.create('Mikrob', 'Problem z pobraniem statusów z tagu: #'+tag);
                  }
    });
  }

  function tagAction(action, tag) {
    var fail = function() { Mikrob.Notification.create('Mikrob', 'Problem z działaniem na tag\'u #'+tag); };
    var callbacksSub = {
      onSuccess : function() {
                    Mikrob.Notification.create('Mikrob', 'Zasubskrybowano tag #'+tag);
                  },
      onFailure : fail
    };

    var callbacksNone = {
      onSuccess : function() {
                    Mikrob.Notification.create('Mikrob', 'Usunięto subskrybcję tagu #'+tag);
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

  function shortlinkExpand(id,element, callback) {

    var url = App.shortlinkStore.get(id);
    if( url) {
      callback(element, url);
    } else {
      this.blipAcc.expandShortlink(id,{
        onSuccess : function(linkData) {
                      App.shortlinkStore.store(id, linkData.original_link);
                      callback(element, linkData.original_link);
                    },
        onFailure : function(){
                      // remove expand action from
                      // unexpandable link
                      callback(element, false);
                    }
      });
    }
  }

  function shortlinkCreate(url, callback) {
    this.blipAcc.createShortlink(url, {
      onSuccess : function(data) {
                    var id = data.url.split('/').reverse()[0];
                    App.shortlinkStore.store('id', url);
                    callback(url, data.url);
                  },
      onFailure : function() {}
    });
  }

  function showMedia(url) {
    embedly.getCode(url, {
      onSuccess : function(object) {
                    console.dir(object);
                    object.original_link = url;
                    Mikrob.Controller.showMedia('embed', object);
                  },
      onFailure : function() {
                    Platform.openURL(url);
                  }
    });
  }

  return {
    OAuthReq : OAuthReq,
    blipAcc : blipAcc,
    blipi : blipi,
    embedly : embedly,
    username : username,
    getCurrentUsername : getCurrentUsername,
    loadDashboard : loadDashboard,
    updateDashboard : updateDashboard,
    createStatus : createStatus,
    deleteStatus : deleteStatus,
    getSingleStatus : getSingleStatus,
    getUserInfo : getUserInfo,
    getGeoLocation : getGeoLocation,
    followUser : followUser,
    unfollowUser : unfollowUser,
    ignoreUser : ignoreUser,
    unignoreUser : unignoreUser,
    getBlipi : getBlipi,
    getThread : getThread,
    getTag : getTag,
    tagAction : tagAction,
    shortlinkExpand : shortlinkExpand,
    shortlinkCreate : shortlinkCreate,
    showMedia : showMedia

  };
})();
