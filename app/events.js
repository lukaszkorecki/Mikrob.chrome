var Mikrob = (Mikrob || {});
Mikrob.Events = (function(){
  function statusListener(event) {
    var el = event.target;
    switch(el.dataset.action) {
      case 'message':
        statusMessage(el);
      break;
      case 'quote':
        statusQuote(el);
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
    if(url.match(/http:\/\/blip.pl/gi)) {
      var id = url.split("/")[url.split("/").length - 1];
      Mikrob.Service.getSingleStatus(id,{
        onSuccess : function(res) {
                      Mikrob.View.showQuotedStatus(res,append);
                      Mikrob.View.sidebarShow();
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
    statusListener : statusListener,
    linkListener : linkListener,
    linkListenerSidebar : linkListenerSidebar,
    updateSubmit : updateSubmit
  };
})();
