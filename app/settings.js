// default settings if none are set
var Settings = (function(){
  var check = {};

  function defaults() {
    var def = {
      refreshInterval : 1000,
    notificationTimeout : 3000,
    notificationsEnabled : true,
    canPoll : true
    };

    localStorage.mikrob_preferences = JSON.stringify(def);
    check = def;
  }

  function getForm(_check) {
    // simplified for now, since we got only one setting
    var val = true;
    if($('#notification_yes').val() == 'on') {
      val = true;
    } else {
      val = false;
    }
    _check.notificationsEnabled = val;
  }

  function setForm(_check) {
    console.dir(check);
    // simplified for now, since we got only one setting
    var selector = "#notification_";
    selector += (_check.notificationsEnabled ? "yes" : "no");
    console.log(selector);
    $(selector).attr('checked', true);
  }

  function save() {
    this.check = JSON.parse(localStorage.mikrob_preferences);
    getForm(this.check);
    console.dir(this.check);
     // localStorage.mikrob_preferences = JSON.stringify(this.check);
  }

  function load() {
    if(localStorage.mikrob_preferences) {
      this.check = JSON.parse(localStorage.mikrob_preferences);
      console.dir(this);
      setForm(this.check);
    } else {
      defaults();
    }
  }

  return {
    load : load,
    check : check,
    save : save
  };
})();
