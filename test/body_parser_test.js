module("Blip Status body parsing");

test("tag parsing", function() {
  var input = "Lol #hahay #test #hahaha";
  var exp = 'Lol <a data-action="tag" data-tag="hahay" href="@hahay">#hahay</a> <a data-action="tag" data-tag="test" href="@test">#test</a> <a data-action="tag" data-tag="hahaha" href="@hahaha">#hahaha</a>';
  var res = BodyParser.tagLink(input, "@");
  equals(res, exp);
});

test('url parsing', function(){
  var input = "hehe http://example.com @lol";
  var exp = 'hehe <a data-action="link" href="http://example.com" data-url="http://example.com">http://example.com</a> @lol';
  var res = BodyParser.justLink(input);
  equals(res,exp);
});

test('username parsing', function(){
  var input = "Lol ^haha ^test";
  var exp = 'Lol <a data-action="user" data-username="haha" href="@haha">^haha</a> <a data-action="user" data-username="test" href="@test">^test</a>';
  var res = BodyParser.userLink(input, "@");
  equals(res,exp);
});

test('parsing body without elements to parse', function() {
  var input = 'nothing nada zero 0';
  var res = BodyParser.userLink(input, "@");
  var res2 = BodyParser.justLink(input);
  var res3 = BodyParser.tagLink(input, "@");
  equals(input, res);
  equals(input, res2);
  equals(input, res3);
});

test('parse complete body', function() {
  var input = "http://blip.pl/s/123 ^lol dostarczyl http://example.com #wat";
  var exp = '<a data-action="bliplink" href="#" data-url="http://blip.pl/s/123">[blip]</a>';
  exp += ' <a data-action="user" data-username="lol" href="http://blip.pl/users/lol">^lol</a>';
  exp += ' dostarczyl';
  exp += ' <a data-action="link" href="http://example.com" data-url="http://example.com">http://example.com</a>';
  exp += ' <a data-action="tag" data-tag="wat" href="http://blip.pl/tags/wat">#wat</a>';

  var res = BodyParser.parse(input);
  equals(res,exp);
});
