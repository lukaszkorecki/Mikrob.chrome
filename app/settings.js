// default settings if none are set
var Settings = (function(){
  // public
  var check = {};

  // private
  function defaults() {
    var def = {
      refreshInterval : 1800,
      notificationTimeout : 3000,
      notificationsEnabled : true,
      canPoll : true
    };

    localStorage.mikrob_preferences = JSON.stringify(def);
    return def;
  }

  // private
  function setFormData(data) {
    $('#preferences input').each(function(i,el){
      // this can be changed to a regex later on
      // so that diff types are accepted
      if(el.type == 'hidden') {
        $(el).attr('value', data[el.name]);
      }
    });
    var selector = data.notificationsEnabled ? 0 : 1;
    $('#preferences input[type=radio]').dom[selector].checked = true;
  }

  // private
  function getFormData() {
    var data = {};
    $('#preferences input').each(function(i,el){
      if(el.type == 'hidden') {
        data[el.name] = JSON.parse(el.value);
      } else if(el.type == 'radio'){
        // assume that if it's not enabled, then it's disabled
        var enabled = !! $('#preferences input[type=radio]').dom[0].checked;
        data[el.name] = enabled;
      }
    });

    return data;
  }

  // public
  function load() {
    if(!! localStorage.mikrob_preferences) {
      this.check = JSON.parse(localStorage.mikrob_preferences);
    } else {
      this.check = defaults();
      localStorage.mikrob_preferences = JSON.stringify(this.check);
    }
    setFormData(this.check);
  }

  // public
  function save() {
    this.check = getFormData();
    localStorage.mikrob_preferences = JSON.stringify(this.check);
  }

  return {
    check : check,
          load : load,
          save : save
  };
})();
