var Blip = function(username, password) {
  this.includeStringUser = "?include=user,recipient";
  this.includeStringFull = "?include=user,user[avatar],recipient,recipient[avatar],pictures";

  this.username = username;
  this.password = password;
  this.apiUrl = "http://api.blip.pl";
  this.requestHeaders = {
    'Accept' : 'application/json',
    'X-Blip-Api' : '0.02',
//    'User-Agent' : 'Mikrob 0.2',
    'X-Blip-Application' : 'Mikrob 0.2'
  };
};

Blip.prototype.getDashboard = function(since, callbacks){
  var request = new Request(this.apiUrl, this.requestHeaders,{
    username : this.username, password : this.password
  });

  request.get("/dashboard"+this.includeStringFull,{
    onSuccess : function(resp) {
                  var obj = JSON.parse(resp.responseText);
                  callbacks.onSuccess(obj);
                },
    onFailure : function(resp) {
                  var obj = JSON.parse(resp.responseText);
                  callbacks.onFailure(obj);
                }
  });
};
