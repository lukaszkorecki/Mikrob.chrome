var Request = function(url, requestHeaders, auth) {
  this.url = url;
  this.auth = auth || {};
  this.requestHeaders = requestHeaders || {};
};

Request.prototype.objToQueryString = function(obj) {
  var str = "";
  for(field in obj) {
    req.setRequestHeader(field, this.requestHeaders[field]);
    str += encodeURIComponent(field) + "=" + encodeURIComponent(obj[field]);
  }
  return str;
};

Request.prototype.httpRequest = function(method, path, data, callbacks) {
  var req = new XMLHttpRequest();

  req.open(method, this.url+path, true, this.auth.username, this.auth.password);

  for(field in this.requestHeaders) {
    req.setRequestHeader(field, this.requestHeaders[field]);
  }


  req.send();
  req.onreadystatechange = function(state) {
    if(req.readyState >= 4) {
      switch(req.status) {
        case 200:
        case 201:
        case 204:
          callbacks.onSuccess(req);
          break;
        default:
          callbacks.onFailure(req);
          break;
      }
    }
  };
};
Request.prototype.get = function(path, callbacks) {
  this.httpRequest('get',path, false, callbacks);
};
Request.prototype.put = function(path, callbacks) {
  this.httpRequest('post',path, false, callbacks);
};
Request.prototype['delete'] = function(path,callbacks) {
  this.httpRequest('delete',path, false, callbacks);
};
Request.prototype.post = function(path,data, callbacks) {
  this.httpRequest('post',path, data, callbacks);
};
