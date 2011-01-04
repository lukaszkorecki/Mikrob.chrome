$(document).ready(function(){

  App.setupViews();
  var blip = App.readyLoadService();

  App.startService(blip);
});

var App = (function(){
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

      if(blip) {
        setInterval(function(){
          ///console.log('Updating', (new Date()));
          Mikrob.Service.updateDashboard(Mikrob.View.viewport);
        }, 10000);
      }
    }
  }
  return {
    setupViews : setupViews,
    readyLoadService : readyLoadService,
    startService : startService
  };
})();
