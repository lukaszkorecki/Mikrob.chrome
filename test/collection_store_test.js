module("Collection Store");
// prepare some fixtures
//
//
var FIXTURES = { record1 : { sup : 'brah?'}, record2 : { problem : 'officer?'} };

test('creates a new instance of CollectionStore',function(){

  var cs = new CollectionStore('test_collection');
  ok(cs);
});

test("creates a new collection and if it's empty stores an empty object",function(){
  var cs = new CollectionStore('test_collection_empty');
  deepEqual(cs.getCurrent(), {});
});

test('saves an object, and serializes it ', function(){
  var cs = new CollectionStore('test_collection_empty');
  cs.store('test_entry', { lol : 'wat'});

  equal(localStorage['test_collection_empty'], "{\"test_entry\":{\"lol\":\"wat\"}}");
});

test('saves an object and retreives it in the same form',function(){
  localStorage['test_collection'] = JSON.stringify(FIXTURES);

  var cs = new CollectionStore('test_collection');
  var rec = cs.get('record1');
  deepEqual(rec, FIXTURES.record1);
});


test('saves a record and then retreives it', function(){
  var ob = { ohai : 'dawg'};
  var cs = new CollectionStore('test_collection');

  cs.store('buka', ob);
  deepEqual(cs.get('buka'), ob);
});

test('removes a newly created record', function(){
  var ob = { ohai : 'dawg'};
  var cs = new CollectionStore('test_collection');

  cs.store('buka', ob);
  deepEqual(cs.get('buka'), ob);

  cs.remove('buka');

  equal(cs.get('buka'), undefined);

});


test('goodbye cruel world',function(){
  // drop the local storage for the test file
  console.log('Clearing localStorage');
  localStorage.clear();
});
