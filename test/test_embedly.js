module('Test Embedly object regexes');
var e = new Embedly();
test('url detection', function() {
  expect(8);
  ok(e.isEmbedable('http://youtube.com/watch?v=trolololo'), 'youtube');
  ok(e.isEmbedable('http://vimeo.com/16009754'), 'vimeo');
  ok(e.isEmbedable('https://foursquare.com/venue/9987805'), '4sq');
  ok(e.isEmbedable('http://picplz.com/user/lukaszkorecki/pic/rmnvp/'), 'picplz');
  ok(e.isEmbedable('http://grooveshark.com/#/playlist/Anime/52355634?src=5'), 'Grooveshark');
  ok(e.isEmbedable('https://gist.github.com/536191'), 'Gist');
  ok(e.isEmbedable('http://www.slideshare.net/paul.irish/perfcompression'), 'slideshare');
  ok(e.isEmbedable('http://soundcloud.com/modman/nyan-cat-dubstep-remix '), 'soundcloud');
});
