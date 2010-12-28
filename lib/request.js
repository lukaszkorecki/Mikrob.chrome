var Request = function(url, requestHeaders, auth) {
  this.url = url;
  this.auth = auth || {};
  this.requestHeaders = requestHeaders || {};
};

Request.prototype.objToQueryString = function(obj) {
  var str = "";
  for(field in obj) {
    str += (field) + "=" + encodeURIComponent(obj[field]);
  }
  return str;
};

Request.prototype.httpRequest = function(method, path, data, callbacks) {
  var req = new XMLHttpRequest();

  req.open(method, this.url+path, true, this.auth.username, this.auth.password);

  for(field in this.requestHeaders) {
    req.setRequestHeader(field, this.requestHeaders[field]);
  }
  if(method.match(/post/gi)) {
    req.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=utf-8");
  }

  var to_send = null;
  if(data) {
    to_send = data; //(this.objToQueryString(data));
  }

  req.send(to_send);
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
  this.httpRequest('GET',path, false, callbacks);
};
Request.prototype.put = function(path, callbacks) {
  this.httpRequest('POST',path, false, callbacks);
};
Request.prototype['delete'] = function(path,callbacks) {
  this.httpRequest('DELETE',path, false, callbacks);
};
Request.prototype.post = function(path,data, callbacks) {
  this.httpRequest('POST',path, data, callbacks);
};
