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
  expect(1);
  var cs = new CollectionStore('test_collection_empty');
  deepEqual(cs.getCurrent(), {});
});

test('saves an object, and serializes it ', function(){
  expect(1);
  var cs = new CollectionStore('test_collection_empty');
  cs.store('test_entry', { lol : 'wat'});

  equal(localStorage['test_collection_empty'], "{\"test_entry\":{\"lol\":\"wat\"}}");
});

test('saves an object and retreives it in the same form',function(){
  expect(1);
  localStorage['test_collection'] = JSON.stringify(FIXTURES);

  var cs = new CollectionStore('test_collection');
  var rec = cs.get('record1');
  deepEqual(rec, FIXTURES.record1);
});


test('saves a record and then retreives it', function(){
  expect(1);
  var cs = new CollectionStore('test_collection');

  cs.store('buka', FIXTURES.record1);
  deepEqual(cs.get('buka'), FIXTURES.record1);
});

test('removes a newly created record', function(){
  expect(2);
  var ob = { ohai : 'dawg'};
  var cs = new CollectionStore('test_collection');

  cs.store('buka', ob);
  deepEqual(cs.get('buka'), ob);

  cs.remove('buka');

  equal(cs.get('buka'), undefined);

});

test('retreives a collection of objects when an list of ids is passed',function(){
  expect(1);
  var cs = new CollectionStore('test_collection');
  cs.store('rec1', FIXTURES.record1);
  cs.store('rec2', FIXTURES.record2);

  var res = cs.get(['rec1', 'rec2']);
  deepEqual(res, [ {rec1 : FIXTURES.record1 } , {rec2 : FIXTURES.record2}]);
});

test('goodbye cruel world',function(){
  // drop the local storage for the test file
  console.log('Clearing localStorage');
  localStorage.clear();
});
