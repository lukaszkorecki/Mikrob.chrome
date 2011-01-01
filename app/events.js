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
                    Mikrob.Notification.create('','Wysłano pomyślnie')
                    Mikrob.Service.updateDashboard(Mikrob.View.viewport);
                    Mikrob.View.enableForm(event.target,true);
                  },
      onFailure : function() {
                    Mikrob.Notification.create('Problem?','Wysłanie nie powiodło się')
                    Mikrob.View.enableForm(event.target);
                  }
    });

    event.preventDefault();
    return false;
   }
  return {
    statusListener : statusListener,
    statusQuote : statusQuote,
    statusMessage : statusMessage,
    updateSubmit : updateSubmit
  };
})();
