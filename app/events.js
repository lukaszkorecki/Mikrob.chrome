var Mikrob = (Mikrob || {});
Mikrob.Events = (function(){

  function checkAndSaveCredentials(event) {
    event.preventDefault();

    Mikrob.Controller.disableForm('login_form');

    var username = event.target[0].value;
    var password = event.target[1].value;

    if(username.length > 0 && password.length > 0 ) {
      var blip = new Blip(username,password);
      blip.verifyCredentials({
        onSuccess : function() {
                      App.startService(App.readyLoadService(username,password));
                      Mikrob.Controller.hideLoginWindow();
                    },
        onFailure : function() {
                      Mikrob.Controller.enableForm('login_form');
                      $('#login_form .message').html('Wpisz poprawne dane!').show();
                    }
      });
    } else {
      Mikrob.Controller.enableForm('login_form');
      $('#login_form .message').html('Wpisz dane!').show();
    }

    return false;
  }

  function updatePreferences(event) {
    event.preventDefault();
    Settings.save();
    return false;
  }

  function setActive(event) {
    var act_class = "active";
    $('.'+act_class).toggleClass(act_class);
    if($(event.target).hasClass('blip')) {
      $(event.target).addClass(act_class);
    } else {
      $(event.target).closest('.blip').addClass(act_class);
    }
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
    Mikrob.Controller.setContents($(el).data('url'),true, true);
  }

  function statusMessage(el) {
    Mikrob.Controller.setContents($(el).data('messagestring'),true, true);
  }

  function statusPicture(el){
    Mikrob.Controller.sidebarShow('picture');
    var o = { url : $(el).data('url'), thumbnail : $(el).data('url').replace(".jpg","_inmsg.jpg") };
    Mikrob.Controller.sidebar.picture.renderTemplate('picture',o);
  }

  function updateSubmit(event){
    event.preventDefault();

    Mikrob.Controller.throbberShow();
    Mikrob.Controller.disableForm('update_form');

    var body = $('#update_body').val();
    var file = $('#update_picture').dom[0].files[0];

    Mikrob.Service.createStatus(body, file, {
      onSuccess : function() {
                    Mikrob.Notification.create('','Wysłano pomyślnie');
                    Mikrob.Service.updateDashboard(Mikrob.Controller.viewport);
                    Mikrob.Controller.enableForm('update_form',true);

                    // clear all fields
                    $('#update_form').dom[0].reset();
                    Mikrob.Controller.throbberHide();
                  },
      onFailure : function() {
                    Mikrob.Notification.create('Problem?','Wysłanie nie powiodło się');
                    Mikrob.Controller.enableForm('update_form');
                    Mikrob.Controller.throbberHide();
                  }
    });

    return false;
  }

  // private functions used by link-clicked event delegator
  function getLink(url,append) {
    Mikrob.Controller.throbberShow();
    Mikrob.Notification.create('', "Rozwijam cytowanie");
    var id = url.split("/")[url.split("/").length - 1];
    Mikrob.Service.getSingleStatus(id,{
      onSuccess : function(res) {
                    App.statusStore.store(id, res);
                    Mikrob.Controller.showQuotedStatus(res,append);
                    Mikrob.Controller.sidebarShow('quote');
                    Mikrob.Controller.throbberHide();
                  },
      onFailure : function(res) {
                    Mikrob.Notification.create('Błąd', "Link prywatny lub usunięty.");
                    console.dir(res);
                    Mikrob.Controller.throbberHide();
                  }
    });
  }
  function getUser(username) {

    Mikrob.Notification.create('', "Pobieam informacje o ^"+username);
    var userFail = function(res) {
      Mikrob.Notification.create('Błąd', "Nie mogę pobrać informacji o ^"+username);
      console.dir(arguments);
      Mikrob.Controller.throbberHide();
    };

    Mikrob.Controller.throbberShow();

    Mikrob.Service.getUserInfo(username,{
      onSuccess : function(response) {
                    App.statusStore.store(response.current_status.id, response.current_status);
                    Mikrob.Controller.showUserInfo(response);
                    Mikrob.Controller.sidebarShow('user');
                    Mikrob.Service.blipAcc.statusesOf(username,{
                      onSuccess : function(response) {
                                    Mikrob.Controller.showUserStatuses(response);
                                    Mikrob.Controller.throbberHide();
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

    var url = $(event.target).data('url');
    var action = $(event.target).data('action');

    // handle different url types
    switch(action) {
      case "bliplink":
        getLink(url,append);
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

      case "link":
        Platform.openURL(url);
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
    checkAndSaveCredentials : checkAndSaveCredentials,
                            updatePreferences : updatePreferences,
                            setActive : setActive,
                            statusListener : statusListener,
                            linkListener : linkListener,
                            linkListenerSidebar : linkListenerSidebar,
                            updateSubmit : updateSubmit,
                            getGeoLocation : getGeoLocation
  };
})();
