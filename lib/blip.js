// singe point-of-communication with the BLIP API
var Blip = function(username, password) {
  this.includeStringUser = "?include=user,user[avatar],avatar,recipient,current_status,current_status[pictures]";
  this.includeStringFull = "?include=user,user[avatar],recipient,recipient[avatar],pictures";

  this.username = username;
  this.password = password;
  this.apiUrl = "http://api.blip.pl";

  // common request handlers defined
  // in the constructor - all of them are required
  // by the 0.02 version of the BLIP API
  // User-Agent can't be overriden by a browser
  this.requestHeaders = {
    'Accept' : 'application/json',
    'X-Blip-Api' : '0.02',
    'X-Blip-Application' : 'Mikrob 0.2'
  };
  this.requestHeaders['Authorization'] = 'Basic '+btoa(this.username+':'+this.password);



};

// returns new request object
Blip.prototype.newRequest = function() {
  return (new Request(this.apiUrl, this.requestHeaders));
};

// wraps callbacks provided by the outside classes
// using built in JSON parser, fixes common issues
// in Blip's API
Blip.prototype.commonHandlers = function(callbacks) {
  return {
    onSuccess : function(resp) {
      // empty response means that nothing changed since last request
      if(resp.responseText.length > 0) {
        try { //
          var obj = JSON.parse(resp.responseText);
        } catch(e) {
          obj = [];
        }
        if(obj['error']) {
          callbacks.onFailure(obj);
        } else {
          callbacks.onSuccess(obj);
        }
      }
    },
    onFailure : function(resp) {
      try {
        console.log(resp.responseText);
        var obj = JSON.parse(resp.responseText);
      } catch(e) {
        console.dir(e);
        obj = [];
      }
      callbacks.onFailure(obj);
    }
  };
};

// downloads users dashboard
// if since is false it just downloads the dash
// otherwise it polls the API for new statuses since the one given
Blip.prototype.getDashboard = function(since, callbacks, offset, limit){

  var url = "/dashboard";
  url += since ? "/since/"+since : '';

  url += this.includeStringFull;

  url += offset ? "&offset="+offset : '';

  var limit_str = (limit !== undefined ? limit : 20);
  url += "&limit="+limit_str;

  var request = this.newRequest();
  request.get(url,this.commonHandlers(callbacks));
};

// create a new text status
Blip.prototype.createStatus = function(body, callbacks) {
  var request = this.newRequest();
  request.post("/updates", 'update[body]='+encodeURIComponent(body), this.commonHandlers(callbacks));
};

// download single status with given ID
Blip.prototype.getStatus = function(id, callbacks) {
  var request = this.newRequest();
  request.get("/updates/"+id+this.includeStringFull, this.commonHandlers(callbacks));
};

// checks user's credentials by downloading one status from the dashboard
Blip.prototype.verifyCredentials = function(callbacks) {
  var request = this.newRequest();
  request.get("/dashboard?limit=1",this.commonHandlers(callbacks));
};

// messages methods


Blip.prototype.getUpdatesOfType = function(type, since,callbacks) {
  var request = this.newRequest();
  var url = "/"+type;

  if (type == 'directed_messages') {
    url += since ? "/"+since+"/since" : '';
  } else {
    url += since ? "/since/"+since : '';
  }

  url += this.includeStringFull+"&limit=50";
  console.log(url);
  request.get(url, this.commonHandlers(callbacks));
};

Blip.prototype.notices = function(since, callbacks) {
  this.getUpdatesOfType('notices', since, callbacks);
};
Blip.prototype.directed = function(since, callbacks) {
  this.getUpdatesOfType('directed_messages', since, callbacks);
};
/*jsl:ignore*/
Blip.prototype.private = function(since, callbacks) {
  this.getUpdatesOfType('private_messages', since, callbacks);
};
/*jsl:end*/



// gets user info

Blip.prototype.userInfo = function(username, callbacks) {
  var request = this.newRequest();
  var url = "/users/"+username+this.includeStringUser;
  request.get(url,this.commonHandlers(callbacks));
};
// statuses sent by a givenen user
Blip.prototype.statusesOf = function(username, callbacks, limit) {
  var requeset = this.newRequest();
  var lmt = limit ? limit : 20;
  var url = "/users/"+username+"/statuses"+this.includeStringFull+"&limit="+lmt;
  request.get(url, this.commonHandlers(callbacks));
};


// tags

Blip.prototype.tag = function(tag, since, callbacks) {
  var request = this.newRequest();
  var url = "/tags/"+tag;
  url += since ? "/since/"+since : "";
  url += this.includeStringFull;
  request.get(url,this.commonHandlers(callbacks));
};
