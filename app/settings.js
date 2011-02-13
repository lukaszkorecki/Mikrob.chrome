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
    return def;
  }

  function setFormData(data) {

    $('#preferences input').each(function(i,el){
      $(el).attr('value', data[el.name]);
    });
  }

  function getFormData(data) {
    $('#preferences input').each(function(i,el){
      data[el.name] = JSON.parse(el.val());
    });

    return data;
  }

  // @public
  function load() {
    if(!! localStorage.mikrob_preferences) {
      this.check = JSON.parse(localStorage.mikrob_preferences);
    } else {
      this.check = defaults();
      localStorage.mikrob_preferences = JSON.stringify(this.check);
      setFormData(this.check);

    }
  }

  function save() {
    this.check = getFormData({});
    localStorage.mikrob_preferences = JSON.stringify(this.check);
  }

  return {
    check : check,
    load : load,
    save : save
  };
})();
