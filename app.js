$(document).ready(function(){

  App.setupViews();
  var blip = App.readyLoadService();

  App.startService(blip);
});

var App = (function(){
  var REFRESH_INTERVAL = 10000;
  var NOTIFICATION_TIMEOUT  = 3000;
  var CAN_POLL = true;
  var statusStore = new CollectionStore('status_store');
  function setupViews() {
    Mikrob.Controller.hideLoginWindow();
    Mikrob.Controller.setUpTimeline('timeline');
    Mikrob.Controller.setUpSidebar('sidebar');

    Mikrob.Controller.setUpCharCounter();
    Mikrob.Controller.setUpBodyCreator();
    Mikrob.Controller.setUpLoginWindow();
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
      Mikrob.Controller.showLoginWindow();
    }
    return blip;
  }

  function startService(blip) {
    if(blip) {
      Mikrob.Service.loadDashboard(blip, Mikrob.Controller.viewport);
      Mikrob.Controller.setLoggedName(Mikrob.Service.blipAcc.username)

      if(blip) {
        setInterval(function(){
          if(this.CAN_POLL) {
            Mikrob.Service.updateDashboard(Mikrob.Controller.viewport);
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
    startService : startService,
    statusStore : statusStore
  };
})();

TESTHANDLERS = {
  onSuccess : function(r) { console.log('ok'); console.dir(r);},
  onFailure : function(r) { console.log('fail'); console.dir(r);}
};
