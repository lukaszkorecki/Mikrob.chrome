var BlipiApi = function(apiKey) {
  this.apiKey = apiKey;
  this.apiUrl = 'http://api.blipi.pl/'+this.apiKey;
  this.searchPrefix = 's%252F';
};


BlipiApi.prototype.newRequest = function() {
  return (new Request(this.apiUrl));
};

BlipiApi.prototype.getThread = function(id, callbacks) {
  var request = this.newRequest();

  request.get('/search/'+this.searchPrefix+id, callbacks);
};
