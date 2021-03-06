// singe point-of-communication with the BLIP API
var Blip = function(username, requestObject) {
  this.includeStringUser = "?include=user,user[avatar],avatar,recipient,current_status,current_status[pictures]";
  this.includeStringFull = "?include=user,user[avatar],recipient,recipient[avatar],pictures&limit=50";
  this.subscriptionParams = '?'+encodeURIComponent('subscription[www]')+'=1&'+encodeURIComponent('subscription[im]')+'=1';

  this.username = username;
  this.apiUrl = "http://api.blip.pl";

  this.requestObject = requestObject;
};

// wraps callbacks provided by the outside classes
// using built in JSON parser, fixes common issues
// in Blip's API
Blip.prototype.commonHandlers = function(callbacks) {
  return {
    onSuccess : function(resp) {
      // empty response means that nothing changed since last request
      if(resp.text.length > 0) {
        try { //
          var obj = JSON.parse(resp.text);
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
      callbacks.onFailure(resp);
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

  this.requestObject.get(this.apiUrl+url,this.commonHandlers(callbacks));
};

// create a new text status
Blip.prototype.createStatus = function(body,file, callbacks) {

  // predefined keys
  var body_key = 'update[body]', pic_key = 'update[picture]', data = {};
  data[body_key] = body;

  // if a file is defined
  // create an object for FormData
  if(typeof file !== 'undefined') { data[pic_key] = file; }

  this.requestObject.post(this.apiUrl+"/updates", data, this.commonHandlers(callbacks));

};

Blip.prototype.remove = function(id, callbacks) {

  this.requestObject['delete'](this.apiUrl+'/statuses/'+id, this.commonHandlers(callbacks));
};
// download single status with given ID
Blip.prototype.getStatus = function(id, callbacks) {
  this.requestObject.get(this.apiUrl+"/updates/"+id+this.includeStringFull, this.commonHandlers(callbacks));
};

// checks user's credentials by downloading one status from the dashboard
Blip.prototype.verifyCredentials = function(callbacks) {
  this.requestObject.get(this.apiUrl+"/dashboard?limit=1",this.commonHandlers(callbacks));
};

Blip.prototype.getCurrentUsername = function(callbacks) {
  this.requestObject.get(this.apiUrl+"/updates"+this.includeStringFull, this.commonHandlers(callbacks));
};

// messages methods
Blip.prototype.getUpdatesOfType = function(type, since,callbacks) {
  var url = "/"+type;

  if (type == 'directed_messages') {
    url += since ? "/"+since+"/since" : '';
  } else {
    url += since ? "/since/"+since : '';
  }

  url += this.includeStringFull; //+"&limit=50";
  this.requestObject.get(this.apiUrl+url, this.commonHandlers(callbacks));
};

Blip.prototype.notices = function(since, callbacks) {
  this.getUpdatesOfType('notices', since, callbacks);
};
Blip.prototype.directed = function(since, callbacks) {
  this.getUpdatesOfType('directed_messages', since, callbacks);
};
Blip.prototype['private'] = function(since, callbacks) {
  this.getUpdatesOfType('private_messages', since, callbacks);
};

// User actions
// info:
Blip.prototype.userInfo = function(username, callbacks) {
  var url = "/users/"+username+this.includeStringUser;
  this.requestObject.get(this.apiUrl+url,this.commonHandlers(callbacks));
};

// statuses sent by a given user
Blip.prototype.statusesOf = function(username, callbacks, limit) {
  var lmt = limit ? limit : 20;
  var url = "/users/"+username+"/dashboard"+this.includeStringFull+"&limit="+lmt;
  this.requestObject.get(this.apiUrl+url, this.commonHandlers(callbacks));
};

Blip.prototype.follow = function(username,callbacks) {
  this.requestObject.put(this.apiUrl+'/subscriptions/'+username+this.subscriptionParams,callbacks);
};

Blip.prototype.unfollow = function(username,callbacks) {
  // pffff
  this.requestObject['delete'](this.apiUrl+'/subscriptions/'+username,callbacks);
};

Blip.prototype.ignore = function(username,callbacks) {
  this.requestObject.put(this.apiUrl+'/users/'+username+'/ignore',callbacks);
};

Blip.prototype.unignore = function(username,callbacks) {
  this.requestObject.put(this.apiUrl+'/users/'+username+'/unignore',callbacks);
};

// Subscriptions: who's following and who is followed
Blip.prototype.followed = function(callbacks){
  this.requestObject.get(this.apiUrl+'/subscriptions/from', callbacks);
};

Blip.prototype.followers = function(callbacks){
  this.requestObject.get(this.apiUrl+'/subscriptions/to', callbacks);
};

// tags
Blip.prototype.tag = function(tag, since, callbacks) {
  var url = "/tags/"+tag;
  url += since ? "/since/"+since : "";
  url += '.json';
  url += this.includeStringFull;
  this.requestObject.get(this.apiUrl+url,this.commonHandlers(callbacks));
};

Blip.prototype.tagSubscribeAll = function(tag, callbacks) {
  this.requestObject.put(this.apiUrl+'/tag_subscriptions/subscribe/'+tag, this.commonHandlers(callbacks));
};

Blip.prototype.tagSubscribeTracked = function(tag, callbacks) {
  this.requestObject.put(this.apiUrl+'/tag_subscriptions/tracked/'+tag, this.commonHandlers(callbacks));
};

Blip.prototype.tagIgnore = function(tag, callbacks) {
  this.requestObject.put(this.apiUrl+'/tag_subscriptions/ignore/'+tag, this.commonHandlers(callbacks));
};

// shortlinks
Blip.prototype.expandShortlink = function(id, callbacks) {
  this.requestObject.get(this.apiUrl+'/shortlinks/'+id+".json", this.commonHandlers(callbacks));
};

Blip.prototype.createShortlink = function(url, callbacks) {
  var data = { 'shortlink[original_link]' : url};
  this.requestObject.post(this.apiUrl+'/shortlinks', data, this.commonHandlers(callbacks));
};
