var Blip = function(username, password) {
  this.username = username;
  this.password = password;
  this.apiUrl = "http://api.blip.pl";
  this.requestHeaders = {
    'Accept' : 'application/json',
    'X-Blip-Api' : '0.02',
    'User-Agent' : 'Mikrob 0.2',
    'X-Blip-Application' : 'Mikrob 0.2'
  };
};

Blip.prototype.getDashboard = function(since){
  var request = new Request(this.apiUrl, this.requestHeaders,{
    username : this.username, password : this.password
  });

  request.get("/dashboard",{
    onSuccess : function() {
                  console.log("success");
                  console.dir(arguments);
                },
    onFailure : function() {
                  console.log("fail");
                  console.dir(arguments);
                }
  });
};
