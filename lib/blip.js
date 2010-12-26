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
  this.request = new Request(this.apiUrl, this.requestHeaders,{
    username : this.username, password : this.password
  });
};

Blip.prototype.getDashboard = function(since, callbacks, offset, limit){

  var url = "/dashboard";
  if (since) { url += "/since/"+since; }

  url += this.includeStringFull;

  if (offset) { url += "&offset="+offset; }

  var limit_str = (limit !== undefined ? limit : 20);
  url += "&limit="+limit_str;

  this.request.get(url,{
    onSuccess : function(resp) {
                  try {

                  var obj = JSON.parse(resp.responseText);
                  } catch(e) {
                    console.log(resp.responseText);
                    console.dir(e);
                    obj = [];
                  }
                  callbacks.onSuccess(obj);
                },
    onFailure : function(resp) {
                  var obj = JSON.parse(resp.responseText);
                  callbacks.onFailure(obj);
                }
  });
};
