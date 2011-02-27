var BlipiApi = function(apiKey) {
  this.apiKey = apiKey;
  this.apiUrl = 'http://api.blipi.pl/'+this.apiKey;
  this.searchPrefix = 's%252F';
};

BlipiApi.prototype.handlers = function(callbacks) {
  return {
    onSuccess : function(resp) {
                  var obj = {};
                  try {
                    obj = JSON.parse(resp.responseText);
                  } catch(e) {
                    obj = {};
                    callbacks.onFailure(obj);
                  }
                  callbacks.onSuccess(obj);
                },
    onFailure : function(resp) {
                  callbacks.onFailure();
                }
  };
};

BlipiApi.prototype.newRequest = function() {
  return (new Request(this.apiUrl));
};

BlipiApi.prototype.getThread = function(id, callbacks) {
  var request = this.newRequest();

  request.get('/search/'+this.searchPrefix+id, this.handlers(callbacks));
};

BlipiApi.prototype.getUserInfo = function(username, callbacks) {
  var req = this.newRequest();
  req.get('/stats/'+username,this.handlers(callbacks));
};
