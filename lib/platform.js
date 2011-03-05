var Platform = (function() {
  function _openUrlTitanium(url) {
    Titanium.Desktop.openURL(url);
  }

  function _openUrlChrome(url) {
    chrome.tabs.create({ url : url } );
  }

  function openURL(url) {
    if(window.Titanium) { _openUrlTitanium(url); }
    if(window.chrome) { _openUrlChrome(url); }
  }

  function templatePath(name) {
    var path = "app://source/templates/"+name+'.mustache';
    if(window && window.chrome) { path = chrome.extension.getURL('templates/'+name+'.mustache'); }
    if(! window) { path = '../templates/'+name+'.mustache'; }
    return path;
  }
  return {
    openURL : openURL,
    templatePath : templatePath
  };
})();
