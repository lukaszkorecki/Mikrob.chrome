$(document).ready(function(){

  Settings.load();
  App.setupViews();

  var blip = App.readyLoadService();
  if(blip) {
    App.startService(blip);
  } else {
    App.firstStart();
  }

});

var App = (function(){


  // legacy stuff clean up
  if(typeof localStorage.status_store !== 'undefined') {
    delete localStorage.status_store;
  }

  function firstStart() {
    Mikrob.Controller.hidePreferencesWindow();
    Mikrob.Controller.setUpLoginWindow();
    Mikrob.Controller.showLoginWindow();

  }
  function rescueOverQuota() {
    var prefs = localStorage.mikrob_preferences;
    var pass = localStorage.access_token_secret;
    var login = localStorage.access_token;

    localStorage.clear();

    localStorage.mikrob_preferences = prefs;
    localStorage.access_token_secret = pass;
    localStorage.access_token = login;
  }

  var statusStore = new CollectionStore('status_store', rescueOverQuota);

  function setupViews() {
    Mikrob.Controller.hideLoginWindow();
    Mikrob.Controller.hidePreferencesWindow();

    Mikrob.Controller.setUpCharCounter();
    Mikrob.Controller.setUpBodyCreator();
    Mikrob.Controller.setUpLoginWindow();
    Mikrob.Controller.setUpPreferencesWindow();

    Mikrob.Controller.setupMoreForm();
  }

  function setupViewports() {
    Mikrob.Controller.setUpViewports();
    Mikrob.Controller.setUpSidebars();
  }
  function readyLoadService() {
    if(localStorage.access_token && localStorage.access_token_secret) {
      Mikrob.User.storeCredentials(localStorage.access_token, localStorage.access_token_secret);
    }
    var user = Mikrob.User.getCredentials();
    var blip = false;

    if(user.access_token && user.access_token_secret) {
      localStorage.removeItem('password');

      Mikrob.Service.OAuthReq.setAccessTokens(user.access_token, user.access_token_secret);
      blip = new Blip(( ''), Mikrob.Service.OAuthReq);
    } else {
      Mikrob.Controller.showLoginWindow();
    }
    return blip;
  }

  function startService(blip) {
    if(blip) {
      Mikrob.Service.getCurrentUsername(blip,function(){
        this.setupViewports();
        Mikrob.Service.loadDashboard( function(){
          Mikrob.Controller.populateInboxColumns();
        });
      }.bind(this));


      Mikrob.Service.getBlipi(BLIPI_KEY);
      setInterval(function(){
        if(Settings.check.canPoll) {
          Mikrob.Service.updateDashboard();
        }
      }, Settings.check.refreshInterval);
    }
  }
  return {
    firstStart : firstStart,
    setupViews : setupViews,
    setupViewports: setupViewports,
    readyLoadService : readyLoadService,
    startService : startService,
    statusStore : statusStore
  };
})();

TESTHANDLERS = {
  onSuccess : function(r) { console.log('ok'); console.dir(r);},
  onFailure : function(r) { console.log('fail'); console.dir(r);}
};

// Shims
if(! Function.prototype.bind) {
  Function.prototype.bind = function(scope) {
    var _function = this;
    return function() { return _function.apply(scope, arguments); };
  };
}

// Titanium workers are w3c
if(! Worker) { Worker = Titanium.Worker; }

// disable httpClient so that Titanium Desktop doesn't leak
if(typeof Titanium != 'undefined' && Titanium.Network) Titanium.Network = undefined;
