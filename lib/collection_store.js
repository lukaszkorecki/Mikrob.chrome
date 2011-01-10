/*
 * Simple storage based on localStorage and JSON parser
 * built in into Chrome (and possibly other WebKit browsers
 */
var CollectionStore = function(name){
  this.collection_name = name;
  if(localStorage[this.collection_name] == undefined) {
    // if collection is empty turn it into an empty object
    localStorage[this.collection_name] = JSON.stringify({});;
  }
}

/* deserialize the collection */
CollectionStore.prototype.getCurrent = function() {
  return JSON.parse(localStorage[this.collection_name]);
};

/* serialize the object */
CollectionStore.prototype.saveCurrent = function(current_data) {
  localStorage[this.collection_name] = JSON.stringify(current_data);
};

/* save (or update) an object under given key */
CollectionStore.prototype.store = function(key, obj) {
  var current_data = this.getCurrent();
  current_data[key] = obj;
  this.saveCurrent(current_data);
};

/* delete an object stored under a given key */
CollectionStore.prototype.remove = function(key) {
  var current_data = this.getCurrent();
  delete current_data[key];
  this.saveCurrent(current_data);
};

/* retreive an object stored under a given key */
CollectionStore.prototype.get = function(key) {
  var current_data = this.getCurrent();
  return current_data[key];
};
