/*
 * Simple storage based on localStorage and JSON parser
 * built in into Chrome (and possibly other WebKit browsers
 */
var CollectionStore = function(name){
  this.collection_name = name;
};

/* save (or update) an object under given key */
CollectionStore.prototype.store = function(key, obj) {
  localStorage[this.collection_name+"_"+key] = JSON.stringify(obj);
};

/* delete an object stored under a given key */
CollectionStore.prototype.remove = function(key) {
  delete localStorage[this.collection_name+"_"+key];
};

/* retreive an object stored under a given key */
CollectionStore.prototype.get = function(key) {
  var res = localStorage[this.collection_name+"_"+key];
  try {
    var obj = JSON.parse(res);
  } catch(e) {
    obj = undefined;
  }
  return obj;
};

CollectionStore.prototype.getSet = function(ids) {
  var self = this;
  return ids.map(function(id){
    var o = {};
    o[id] = self.get(id);
    return o;
  });
};

CollectionStore.prototype.empty = function(key) {
  localStorage[this.collection_name] = "[]";
};
