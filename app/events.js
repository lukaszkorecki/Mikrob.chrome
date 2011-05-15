var Mikrob = (Mikrob || {});
Mikrob.Events = (function(){

  function oauthDance() {
    Mikrob.Service.OAuthReq.requestAuth();
    return false;
  }
  function checkAndSaveCredentials(event) {
    event.preventDefault();

    Mikrob.Controller.disableForm('login_form');

    var pin = event.target[1].value;

    if(pin.length > 0) {
      Mikrob.Service.OAuthReq.userAuthorize(pin, {
        onSuccess : function(oauth_tokens) {
                      Mikrob.User.storeCredentials(oauth_tokens.oauth_token, oauth_tokens.oauth_token_secret);
                      window.location.reload();
                    },
        onFailure : function() {
                      Mikrob.Notification.create('', 'Błąd autoryzacji');
                    }
      });
    } else {
      Mikrob.Controller.enableForm('login_form');
      $('#login_form .message').html('Wpisz pin!').show();
    }

    return false;
  }

  function updatePreferences(event) {
    event.preventDefault();
    Settings.save();
    return false;
  }

  function statusListener(event) {
    var el = event.target;
    var action = $(el).data('action');
    switch(action) {
      case 'message':
        statusMessage(el);
        break;
      case 'quote':
        statusQuote(el);
        break;
      case 'picture':
        statusPicture(el);
        break;
      case 'delete':
        statusDelete(el);
        break;
      case 'thread':
        // ho ho ho
        var id = $(el).data('url').split("/").reverse()[0];
        Mikrob.Service.getThread(id);
        break;
      default:
        break;

    }
    if($(el).data('action').match(/message|quote/gi)) {
      Mikrob.Controller.showMoreForm();
    }
  }
  function statusDelete(el) {
    if(window.confirm('Usunąć status?')) {
      Mikrob.Service.deleteStatus($(el).data('blipid'));
    }
  }
  function statusQuote(el) {
    Mikrob.Controller.setContents($(el).data('url'), false, true);
  }

  function statusMessage(el) {
    Mikrob.Controller.setContents($(el).data('messagestring'),true, true);
  }

  function statusPicture(el){
    var o = { url : $(el).data('url'), thumbnail : $(el).data('url').replace(".jpg","_inmsg.jpg") };
    Mikrob.Controller.showMedia('picture',o);
  }

  function onEnter(event) {
    if(event.keyCode == 13) {
      Mikrob.Events.updateSubmit(event);
      return false;
    }
    return true;
  }

  function updateSubmit(event){
    event.preventDefault();

    Mikrob.Controller.disableForm('update_form');

    var body = $('#update_body').val();
    var file = $('#update_picture').dom[0].files[0];

    Mikrob.Service.createStatus(body, file, {
      onSuccess : function() {
                    Mikrob.Service.updateDashboard(Mikrob.Controller.viewport);
                    Mikrob.Controller.enableForm('update_form',true);

                    // clear all fields
                    $('#update_form').dom[0].reset();
                  },
      onFailure : function() {
                    var msg = 'Wysłanie nie powiodło się. ';
                    msg += (file ?  'Prawdopodobnie załącznik jest zbyt duży.' :  'Blip nie odpowiedzial poprawnie.')

                    Mikrob.Notification.create('',msg);
                    Mikrob.Controller.enableForm('update_form');
                  }
    });

    return false;
  }

  // private functions used by link-clicked event delegator
  function getLink(url,append) {
    var id = url.split("/")[url.split("/").length - 1];
    Mikrob.Service.getSingleStatus(id,{
      onSuccess : function(res) {
                    App.statusStore.store(id, res);
                    Mikrob.Controller.showQuotedStatus(res,append);
                    Mikrob.Controller.sidebarShow('quote');
                  },
      onFailure : function(res) {
                    Mikrob.Notification.create('Błąd', "Link prywatny lub usunięty.");
                    console.dir(res);
                  }
    });
  }
  function getUser(username) {
    Mikrob.Notification.create('', "Pobieam informacje o ^"+username);
    var userFail = function(res) {
      Mikrob.Notification.create('Błąd', "Nie mogę pobrać informacji o ^"+username);
      console.dir(arguments);
    };


    Mikrob.Service.getUserInfo(username,{
      onSuccess : function(response) {
                    App.statusStore.store(response.current_status.id, response.current_status);
                    Mikrob.Controller.showUserInfo(response);
                    Mikrob.Controller.sidebarShow('user');
                    Mikrob.Service.blipAcc.statusesOf(username,{
                      onSuccess : function(response) {
                                    Mikrob.Controller.showUserStatuses(response);
                                  },
                      onFailure : userFail
                    });
                    Mikrob.Service.blipi.getUserInfo(username, {
                      onSuccess : function(response) {
                                    console.dir(response);
                                    Mikrob.Controller.showUserInfoBlipi(username,response);
                                  },
                      onFailure : userFail
                    });
                  },
      onFailure : userFail
    });

  }
  function linkListener(event,append) {
    event.preventDefault();

    var url = $(event.target).data('url') || $(event.target).attr('href');
    var action = $(event.target).data('action');

    console.log(action, url);
    // handle different url types
    switch(action) {
      case "bliplink":
        getLink(url,append);
        break;

      case 'expand':
        Mikrob.Controller.expandShortlinks();
        Platform.openURL(url);
        break;
      case 'user':
        var username = $(event.target).data('username');
        getUser(username);
        break;

      case 'follow':
        Mikrob.Service.followUser($(event.target).data('user'));
        break;

      case 'unfollow':
        Mikrob.Service.unfollowUser($(event.target).data('user'));
        break;

      case 'ignore':
        Mikrob.Service.ignoreUser($(event.target).data('user'));
        break;

      case 'unignore':
        Mikrob.Service.unignoreUser($(event.target).data('user'));
        break;
      case "link":
        console.log(Mikrob.Service.embedly.isEmbedable(url));
        if(Mikrob.Service.embedly.isEmbedable(url)) {
          Mikrob.Service.showMedia(url);
        } else {
          Platform.openURL(url);
        }
        break;

      case'tag':
        Mikrob.Service.getTag($(event.target).data('tag'));
        break;

      case 'tags_subscribe_all':
        Mikrob.Service.tagAction('all',$(event.target).data('tag'));
        break;
      case 'tags_subscribe_friend':
        Mikrob.Service.tagAction('tracked',$(event.target).data('tag'));
        break;
      case 'tags_subscribe_none':
        Mikrob.Service.tagAction('none',$(event.target).data('tag'));
        break;
      default:
        // do nothing
        break;
    }
    if(action == undefined) {
      var _url = $(event.target).attr('href');
      if(_url != undefined && _url.match(/^http/gi)) { Platform.openURL(_url); }
    }
    return false;

  }
  function linkListenerSidebar(event) {
    linkListener(event,true);
  }


  function getGeoLocation(event) {
    event.preventDefault();
    Mikrob.Service.getGeoLocation();
    return false;
  }

  return {
    oauthDance : oauthDance,
    checkAndSaveCredentials : checkAndSaveCredentials,
    updatePreferences : updatePreferences,
    setActive : setActive,
    statusListener : statusListener,
    linkListener : linkListener,
    linkListenerSidebar : linkListenerSidebar,
    updateSubmit : updateSubmit,
    onEnter: onEnter,
    getGeoLocation : getGeoLocation
  };
})();
