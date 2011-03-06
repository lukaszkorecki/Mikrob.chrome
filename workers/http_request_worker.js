self.onmessage = function(event) {

  var url = event.data.url,
      method = event.data.method,
      path = event.data.path,
      auth = event.data.auth,
      requestHeaders = event.data.requestHeaders;

  var req = new XMLHttpRequest();

  req.open(method, url+path, true, auth.username, auth.password);

  for(field in requestHeaders) {
    req.setRequestHeader(field, requestHeaders[field]);
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
      // This will not work!
      // not because createFormData is not defined
      // but beause formData isn't available in the worker thread
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
          postMessage({ ok : true, responseText : req.responseText});
          break;
        default:
          postMessage({ ok : false, responseText : req.responseText});
          break;
      }
    }
  };
};
