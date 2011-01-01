var Mikrob = (Mikrob || {});
Mikrob.Notification = (function(){
  function create(title, body,icon){
    var ic = (icon || 'assets/mikrob_icon_48.png');
    var notif = webkitNotifications.createNotification(ic,title,body);
    notif.ondisplay = function() {
      setTimeout(function(){
        notif.cancel();
      }, 3000);
    };
    notif.show();
  }

  return {
    create : create
  };
})();
