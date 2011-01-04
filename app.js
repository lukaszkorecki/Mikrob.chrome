$(document).ready(function(){

  App.setupViews();
  var blip = App.readyLoadService();

  App.startService(blip);
});

var App = (function(){
  var REFRESH_INTERVAL = 10000;
  var NOTIFICATION_TIMEOUT  = 3000;
  var CAN_POLL = true;
  function setupViews() {
    Mikrob.View.hideLoginWindow();
    Mikrob.View.setUpTimeline('timeline');
    Mikrob.View.setUpSidebar('sidebar');

    Mikrob.View.setUpCharCounter();
    Mikrob.View.setUpBodyCreator();
    Mikrob.View.setUpLoginWindow();
  }
  function readyLoadService(username,password) {
    if(username && password) {
      Mikrob.User.storeCredentials(username, password);
    }
    var user = Mikrob.User.getCredentials();
    var blip = false;

    if(user.username && user.password) {
      blip = new Blip(user.username, user.password);
    } else {
      Mikrob.View.showLoginWindow();
    }
    return blip;
  }

  function startService(blip) {
    if(blip) {
      Mikrob.Service.loadDashboard(blip, Mikrob.View.viewport);
      Mikrob.View.setLoggedName(Mikrob.Service.blipAcc.username)

      if(blip) {
        setInterval(function(){
          if(this.CAN_POLL) {
            Mikrob.Service.updateDashboard(Mikrob.View.viewport);
          }
        }.bind(this), this.REFRESH_INTERVAL);
      }
    }
  }
  return {
    REFRESH_INTERVAL : REFRESH_INTERVAL,
    NOTIFICATION_TIMEOUT : NOTIFICATION_TIMEOUT,
    CAN_POLL : CAN_POLL,
    setupViews : setupViews,
    readyLoadService : readyLoadService,
    startService : startService
  };
})();
