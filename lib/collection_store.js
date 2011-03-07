/*
 * Simple storage based on localStorage and JSON parser
 * built in into Chrome (and possibly other WebKit browsers
 */
var CollectionStore = function(name, migrate_function){
  this.collection_name = name;
  this.migrate = migrate_function;
};

/* save (or update) an object under given key */
CollectionStore.prototype.store = function(key, obj) {
  try {
    localStorage.setItem(this.collection_name+"_"+key, JSON.stringify(obj));
  } catch(e) {
    this.migrate();
  }
};

/* delete an object stored under a given key */
CollectionStore.prototype.remove = function(key) {
  delete localStorage[this.collection_name+"_"+key];
};

/* retreive an object stored under a given key */
CollectionStore.prototype.get = function(key) {
  var res = localStorage.getItem(this.collection_name+"_"+key);
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
  localStorage.setItem(this.collection_name, "[]");
};
