var Mikrob = (Mikrob || {});
Mikrob.Events = (function(){

  function checkAndSaveCredentials(event) {
    Mikrob.View.disableForm(event.target);

    var username = event.target[0].value;
    var password = event.target[1].value;

    if(username.length > 0 && password.length > 0 ) {
      var blip = new Blip(username,password)
      blip.verifyCredentials({
        onSuccess : function() {
          App.startService(App.readyLoadService(username,password));
          Mikrob.View.hideLoginWindow();
        },
        onFailure : function() {
          Mikrob.View.enableForm(event.target);
          $('#login_form .message').html('Wpisz poprawne dane!').show();
        }
      });
    } else {
      Mikrob.View.enableForm(event.target);
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
    Mikrob.View.setContents(el.dataset.url,true, true);
  }

  function statusMessage(el) {
    Mikrob.View.setContents(el.dataset.messagestring,true, true);
  }

  function statusPicture(el){
    Mikrob.View.sidebarShow('picture');
    var o = { url : el.dataset.url };
    Mikrob.View.sidebar.picture.renderTemplate('picture',o);
  }

  function updateSubmit(event){
    Mikrob.View.disableForm(event.target);
    Mikrob.Service.createStatus($('#update_body').attr('value'),{
      onSuccess : function() {
                    Mikrob.Notification.create('','Wysłano pomyślnie');
                    Mikrob.Service.updateDashboard(Mikrob.View.viewport);
                    Mikrob.View.enableForm(event.target,true);
                  },
      onFailure : function() {
                    Mikrob.Notification.create('Problem?','Wysłanie nie powiodło się');
                    Mikrob.View.enableForm(event.target);
                  }
    });

    event.preventDefault();
    return false;
   }

  function linkListener(event,append) {
    var url = event.target.getAttribute('href');

    // handle different url types
    if(url.match(/.blip.pl\/(s|pm|dm)\//gi)) {
      var id = url.split("/")[url.split("/").length - 1];
      Mikrob.Service.getSingleStatus(id,{
        onSuccess : function(res) {
                      Mikrob.View.showQuotedStatus(res,append);
                      Mikrob.View.sidebarShow('quote');
                    },
        onFailure : function(res) {
                      console.dir(res);
                    }
      });
    } else {
      // open all other links in a new tab
      chrome.tabs.create({ url : url } );
    }
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
