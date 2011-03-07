$(document).ready(function(){

  Settings.load();
  var blip = App.readyLoadService();

  App.startService(blip);
  App.setupViews();
});

var App = (function(){
  // legacy stuff clean up
  if(typeof localStorage.status_store !== 'undefined') {
    delete localStorage.status_store;
  }

  function rescueOverQuota() {
    var prefs = localStorage.mikrob_preferences;
    var pass = localStorage.password;
    var login = localStorage.username;

    localStorage.clear();

    localStorage.mikrob_preferences = prefs;
    localStorage.password = pass;
    localStorage.username = login;
  }

  var statusStore = new CollectionStore('status_store', rescueOverQuota);
  var messagesStore = new CollectionStore('messages_store', rescueOverQuota);
  var messagesIds = new CollectionStore('messages_ids', rescueOverQuota);

  function setupViews() {
    Mikrob.Controller.hideLoginWindow();
    Mikrob.Controller.hidePreferencesWindow();
    Mikrob.Controller.setUpViewports();
    Mikrob.Controller.setUpSidebars();

    Mikrob.Controller.setUpCharCounter();
    Mikrob.Controller.setUpBodyCreator();
    Mikrob.Controller.setUpLoginWindow();
    Mikrob.Controller.setUpPreferencesWindow();

    Mikrob.Controller.setupMoreForm();
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
      Mikrob.Service.loadDashboard(blip, Mikrob.Controller.viewport, function(){
        Mikrob.Controller.populateInboxColumns();
        Mikrob.Controller.throbberHide();
      });

      if(blip) {
        Mikrob.Service.getBlipi(BLIPI_KEY);
        setInterval(function(){
          if(Settings.check.canPoll) {
            Mikrob.Service.updateDashboard(Mikrob.Controller.viewport);
          }
        }, Settings.check.refreshInterval);
      }
    }
  }
  return {
    setupViews : setupViews,
    readyLoadService : readyLoadService,
    startService : startService,
    statusStore : statusStore,
    messagesStore : messagesStore,
    messagesIds : messagesIds
  };
})();

TESTHANDLERS = {
  onSuccess : function(r) { console.log('ok'); console.dir(r);},
  onFailure : function(r) { console.log('fail'); console.dir(r);}
};

if(! Function.prototype.bind) {
  Function.prototype.bind = function(scope) {
    var _function = this;
    return function() { return _function.apply(scope, arguments); }
  }
}

if(! Worker) {
  Worker = Titanium.Worker;
}

if(Titanium.Network) Titanium.Network = null;
