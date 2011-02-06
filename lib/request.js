var Request = function(url, requestHeaders, auth) {
  this.url = url;
  this.auth = auth || {};
  this.requestHeaders = requestHeaders || {};
};

Request.prototype.createFormData = function(obj) {
  var data = new FormData();
  for(var field in obj) {
    data.append(field, obj[field]);
  }
  return data;
};

Request.prototype.httpRequest = function(method, path, data, callbacks) {
  var req = new XMLHttpRequest();

  req.open(method, this.url+path, true, this.auth.username, this.auth.password);

  for(field in this.requestHeaders) {
    req.setRequestHeader(field, this.requestHeaders[field]);
  }

  var to_send = null;

  if(method.match(/post/gi)) {
    // XXX this weird behaviour is due to the fact
    // that when posting a new status to Blip's API
    // Content type must be different if it's only
    // a text update
    // if an update contains text AND an image attachement
    // the upload needs to switch to multipart content type
    if(typeof data == 'string') {
      req.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=utf-8");
      to_send = data;
    }
    if(typeof data == 'object') {
      to_send = this.createFormData(data);
    }
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
  this.httpRequest('PUT',path, false, callbacks);
};
Request.prototype['delete'] = function(path,callbacks) {
  this.httpRequest('DELETE',path, false, callbacks);
};
Request.prototype.post = function(path,data, callbacks) {
  this.httpRequest('POST',path, data, callbacks);
};
