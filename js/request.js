var Request = function(url, requestHeaders, auth) {
  this.url = url;
  this.auth = auth || {};
  this.requestHeaders = requestHeaders || {};
};

Request.prototype.get = function(path, callbacks) {
  var req = new XMLHttpRequest();

  req.open('get', path, true, this.auth.username, this.auth.password);

  for(header in this.requestHeaders) {
    req.setRequestHeader(field, this.requestHeaders[field]);
  }


  req.send();
  req.onreadystatechange = function(state) {
    if(req.readyState >= 4) {
      switch(req.status) {
        case 200:
        case 201:
          callbacks.onSuccess(req);
          break;
        default:
          callbacks.onFailure(req);
          break;
      }
    }
  };
};
