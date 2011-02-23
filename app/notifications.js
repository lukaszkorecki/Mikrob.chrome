var Mikrob = (Mikrob || {});
Mikrob.Notification = (function(){
  function autoClose(event) {
    setTimeout(function(){
      event.target.cancel();
    }, Settings.check.notificationTimeout);
  }

  function _webkitNotif(title, body, icon) {
    var ic = (icon || 'assets/mikrob_icon_48.png');
    var notif = webkitNotifications.createNotification(ic,title,body);
    notif.ondisplay = autoClose;
    notif.onshow = autoClose;
    notif.show();
  }

  function _titaniumNotif(title, body, icon) {
    var ic = (icon || 'app://sources/assets/mikrob_icon_48.png');
    try {
      var ti_win = Titanium.UI.getMainWindow(); // get the main window
      var ti_note = Titanium.Notification.createNotification(ti_win);
    } catch (notify_error) {
      console.log("Windows cant have Notification");
      ti_note = false;
    }

    if(ti_note) {
      ti_note.setTitle(title);
      ti_note.setMessage(body);
      ti_note.setIcon(ic);

      ti_note.show();
    }

  }

  function create(title, body,icon){
    if(window.webkitNotifications) {
      _webkitNotif(title, body, icon);
    }
    if(typeof window.Titanium != 'undefined') {
      _titaniumNotif(title, body, icon);
    }
  }

  return {
    create : create
  };
})();
