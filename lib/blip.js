var Blip = function(username, password) {
  this.includeStringUser = "?include=user,recipient";
  this.includeStringFull = "?include=user,user[avatar],recipient,recipient[avatar],pictures";

  this.username = username;
  this.password = password;
  this.apiUrl = "http://api.blip.pl";

  // User-Agent can't be overriden by a browser
  this.requestHeaders = {
    'Accept' : 'application/json',
    'X-Blip-Api' : '0.02',
    'X-Blip-Application' : 'Mikrob 0.2'
  };
  this.requestHeaders['Authorization'] = 'Basic '+btoa(this.username+':'+this.password);



};
Blip.prototype.newRequest = function() {
  return (new Request(this.apiUrl, this.requestHeaders));
};

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
      console.dir(resp);
      try {
        var obj = JSON.parse(resp.responseText);
      } catch(e) {
        console.dir(e);
        obj = [];
      }
      callbacks.onFailure(obj);
    }
  };
};
Blip.prototype.getDashboard = function(since, callbacks, offset, limit){

  var url = "/dashboard";
  if (since) { url += "/since/"+since; }

  url += this.includeStringFull;

  if (offset) { url += "&offset="+offset; }

  var limit_str = (limit !== undefined ? limit : 20);
  url += "&limit="+limit_str;

  var request = this.newRequest();
  request.get(url,this.commonHandlers(callbacks));
};

Blip.prototype.createStatus = function(body, callbacks) {
  var request = this.newRequest();
  request.post("/updates", 'update[body]='+encodeURIComponent(body), this.commonHandlers(callbacks));
};

Blip.prototype.getStatus = function(id, callbacks) {
  var request = this.newRequest();
  request.get("/updates/"+id+this.includeStringFull, this.commonHandlers(callbacks));
};
Blip.prototype.verifyCredentials = function(callbacks) {
  var request = this.newRequest();
  request.get("/dashboard?limit=1",this.commonHandlers(callbacks));
}
