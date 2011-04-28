module("Blip Status body parsing");

test("tag parsing", function() {
  expect(1);
  var input = "Lol #hahay #test #hahaha";
  var exp = 'Lol <a data-action="tag" data-tag="hahay" href="@hahay">#hahay</a> <a data-action="tag" data-tag="test" href="@test">#test</a> <a data-action="tag" data-tag="hahaha" href="@hahaha">#hahaha</a>';
  var res = BodyParser.tagLink(input, "@");
  equals(res, exp);
});

test('url parsing', function(){
  expect(1);
  var input = "hehe http://example.com @lol";
  var exp = 'hehe <a data-action="link" href="http://example.com" data-url="http://example.com">http://example.com</a> @lol';
  var res = BodyParser.justLink(input);
  equals(res,exp);
});

test('username parsing', function(){
  expect(1);
  var input = "Lol ^haha ^test";
  var exp = 'Lol <a data-action="user" data-username="haha" href="@haha">^haha</a> <a data-action="user" data-username="test" href="@test">^test</a>';
  var res = BodyParser.userLink(input, "@");
  equals(res,exp);
});

test('parsing body without elements to parse', function() {
  expect(3);
  var input = 'nothing nada zero 0';
  var res = BodyParser.userLink(input, "@");
  var res2 = BodyParser.justLink(input);
  var res3 = BodyParser.tagLink(input, "@");
  equals(input, res);
  equals(input, res2);
  equals(input, res3);
});

test('status location parsing',function(){
  expect(3);
  var input = "@/brooklyn, ny/";
  var res = BodyParser.statusLocation(input);
  var exp = "<span class='pic location'>(Lokacja: <input type='image' src='assets/location_black_16.png' data-action='picture' data-url='http://maps.google.com/maps/api/staticmap?center=brooklyn,%20ny&zoom=14&size=350x350&sensor=true&markers=size:small|color:red|brooklyn,%20ny' />)</span>";

  var input1 = "lol @/brooklyn, ny/ hehe";
  var res1 = BodyParser.statusLocation(input1);
  var exp1 = "lol <span class='pic location'>(Lokacja: <input type='image' src='assets/location_black_16.png' data-action='picture' data-url='http://maps.google.com/maps/api/staticmap?center=brooklyn,%20ny&zoom=14&size=350x350&sensor=true&markers=size:small|color:red|brooklyn,%20ny' />)</span> hehe";

  var input2 = "lol @/56.32457349, 23.930453480/ hehe";
  var res2 = BodyParser.statusLocation(input2);
  var exp2 = "lol <span class='pic location'>(Lokacja: <input type='image' src='assets/location_black_16.png' data-action='picture' data-url='http://maps.google.com/maps/api/staticmap?center=56.32457349,%2023.930453480&zoom=14&size=350x350&sensor=true&markers=size:small|color:red|56.32457349,%2023.930453480' />)</span> hehe";

  equals(res, exp);
  equals(res1, exp1);
  equals(res2, exp2);


});

test('parse complete body', function() {
  expect(1);
  var input = "http://blip.pl/s/123 ^lol dostarczyl @/56.32457349, 23.930453480/ http://example.com #wat";
  var exp = '<a data-action="bliplink" href="#" data-url="http://blip.pl/s/123">[blip]</a>';
  exp += ' <a data-action="user" data-username="lol" href="http://blip.pl/users/lol">^lol</a>';
  exp += ' dostarczyl';

  exp += " <span class='pic location'>(Lokacja: <input type='image' src='assets/location_black_16.png' data-action='picture' data-url='http://maps.google.com/maps/api/staticmap?center=56.32457349,%2023.930453480&zoom=14&size=350x350&sensor=true&markers=size:small|color:red|56.32457349,%2023.930453480' />)</span>";
  exp += ' <a data-action="link" href="http://example.com" data-url="http://example.com">http://example.com</a>';
  exp += ' <a data-action="tag" data-tag="wat" href="http://blip.pl/tags/wat">#wat</a>';

  var res = BodyParser.parse(input);
  equals(res,exp);
});
