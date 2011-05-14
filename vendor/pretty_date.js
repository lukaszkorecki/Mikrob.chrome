/*
 * JavaScript Pretty Date
 * Copyright (c) 2008 John Resig (jquery.com)
 * Licensed under the MIT license.
 */

// Takes an ISO time and returns a string representing how
// long ago the date represents.
var PrettyDate = {

  // for titanium
  parse : function (string) {

    var t = new Date(string);

    if(isNaN(t.getMonth())) {
      var date = string.split(' ')[0].split('-'),
          time = string.split(' ')[1].split(':');
      t = new Date(date[0], date[1]-1, date[2], time[0], time[1], time[2]);
    }

    return t;
  },

  pretty : function(time, offset) {
    var date =  this.parse(time).getTime(),
        current_date = new Date().getTime(),
        diff = ((current_date - date) / 1000) + (offset * 3600),
        day_diff = Math.floor(diff / 86400);

    if(day_diff < 0 ) return time; // [current_date, date, day_diff , diff].join(" | ");

    return day_diff == 0 && (
        diff < 60 && "przed chwilą" ||
        diff < 120 && "minutę temu" ||
        diff < 3600 && Math.floor( diff / 60 ) + " minut temu" ||
        diff < 7200 && "godzinę temu" ||
        diff < 86400 && Math.floor( diff / 3600 ) + " godzin temu") ||
      day_diff == 1 && "wczoraj" ||
      day_diff < 7 && day_diff + " dni temu" ||
      day_diff < 31 && Math.ceil( day_diff / 7 ) + " tygodni temu";
  }
};
