var Mikrob = (Mikrob || {});
Mikrob.Notification = (function(){
  function autoClose(event) {
    console.dir(arguments);
    setTimeout(function(){
      event.target.cancel();
    }, Settings.check.notificationTimeout);
  }

  function create(title, body,icon){
    var ic = (icon || 'assets/mikrob_icon_48.png');
    var notif = webkitNotifications.createNotification(ic,title,body);
    notif.ondisplay = autoClose;
    notif.onshow = autoClose;
    notif.show();
  }

  return {
    create : create
  };
})();
