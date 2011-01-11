var Mikrob = (Mikrob || {});
Mikrob.Events = (function(){

  function checkAndSaveCredentials(event) {
    Mikrob.Controller.disableForm(event.target);

    var username = event.target[0].value;
    var password = event.target[1].value;

    if(username.length > 0 && password.length > 0 ) {
      var blip = new Blip(username,password)
      blip.verifyCredentials({
        onSuccess : function() {
          App.startService(App.readyLoadService(username,password));
          Mikrob.Controller.hideLoginWindow();
        },
        onFailure : function() {
          Mikrob.Controller.enableForm(event.target);
          $('#login_form .message').html('Wpisz poprawne dane!').show();
        }
      });
    } else {
      Mikrob.Controller.enableForm(event.target);
      $('#login_form .message').html('Wpisz dane!').show();
    }

    event.preventDefault();
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
    switch(el.dataset.action) {
      case 'message':
        statusMessage(el);
      break;
      case 'quote':
        statusQuote(el);
      break;
      case 'picture':
        statusPicture(el);
        break;
      default:
      break;

    }
  }
  function statusQuote(el) {
    Mikrob.Controller.setContents(el.dataset.url,true, true);
  }

  function statusMessage(el) {
    Mikrob.Controller.setContents(el.dataset.messagestring,true, true);
  }

  function statusPicture(el){
    Mikrob.Controller.sidebarShow('picture');
    var o = { url : el.dataset.url, thumbnail : el.dataset.url.replace(".jpg","_inmsg.jpg") };
    Mikrob.Controller.sidebar.picture.renderTemplate('picture',o);
  }

  function updateSubmit(event){
    Mikrob.Controller.disableForm(event.target);
    Mikrob.Service.createStatus($('#update_body').attr('value'),{
      onSuccess : function() {
                    Mikrob.Notification.create('','Wysłano pomyślnie');
                    Mikrob.Service.updateDashboard(Mikrob.Controller.viewport);
                    Mikrob.Controller.enableForm(event.target,true);
                  },
      onFailure : function() {
                    Mikrob.Notification.create('Problem?','Wysłanie nie powiodło się');
                    Mikrob.Controller.enableForm(event.target);
                  }
    });

    event.preventDefault();
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
      onFailure : console.dir
    });
  }
  function getUser(username) {
    Mikrob.Service.getUserInfo(username,{
      onSuccess : function(response) {
        App.statusStore.store(response.current_status.id, response.current_status);
        Mikrob.Controller.showUserInfo(response);
        Mikrob.Controller.sidebarShow('user');
      },
      onFailure : console.dir
    });

  }
  function linkListener(event,append) {
    var url = event.target.dataset.url;
    // handle different url types
    // TODO this should be a switch statement
    if(event.target.dataset.action == "bliplink") {
      getLink(url,append);
    }

    // show user info
    if (event.target.dataset.action == 'user') {
      var username = event.target.dataset.username;
      getUser(username);
    };


    // open all other links in a new tab
    if(event.target.dataset.action == "link") {
      chrome.tabs.create({ url : url } );
    }

    // stop the event
    event.preventDefault(); return false;

  }
  function linkListenerSidebar(event) {
    linkListener(event,true);
  }

  return {
    checkAndSaveCredentials : checkAndSaveCredentials,
    setActive : setActive,
    statusListener : statusListener,
    linkListener : linkListener,
    linkListenerSidebar : linkListenerSidebar,
    updateSubmit : updateSubmit
  };
})();
