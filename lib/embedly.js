var Embedly = function() {
  this.request = new Request('http://api.embed.ly/1');
  this.requiredParams = "&maxwidth=600&format=json";
  _approved = [];
  _approved.push('http:\/\/(www\.)?flickr\.com\/photos\/.*');
  _approved.push('flic\.kr\/.*');
  _approved.push('.*imgur\.com\/.*');
  _approved.push('.*dribbble\.com\/shots\/.*');
  _approved.push('drbl\.in\/.*');
  _approved.push('picasaweb\.google\.com.*\/.*\/.*#.*');
  _approved.push('picasaweb\.google\.com.*\/lh\/photo\/.*');
  _approved.push('picasaweb\.google\.com.*\/.*\/.*');
  _approved.push('instagr\.am\/p\/.*');
  _approved.push('instagram\.com\/p\/.*');
  _approved.push('skitch\.com\/.*\/.*\/.*');
  _approved.push('img\.skitch\.com\/.*');
  _approved.push('https:\/\/skitch\.com\/.*\/.*\/.*');
  _approved.push('https:\/\/img\.skitch\.com\/.*');
  _approved.push('picplz\.com\/user\/.*\/pic\/.*\/');
  _approved.push('soundcloud\.com\/.*');
  _approved.push('soundcloud\.com\/.*\/.*');
  _approved.push('soundcloud\.com\/.*\/sets\/.*');
  _approved.push('soundcloud\.com\/groups\/.*');
  _approved.push('snd\.sc\/.*');
  _approved.push('last\.fm\/music\/.*');
  _approved.push('last\.fm\/music\/+videos\/.*');
  _approved.push('last\.fm\/music\/+images\/.*');
  _approved.push('last\.fm\/music\/.*\/_\/.*');
  _approved.push('last\.fm\/music\/.*\/.*');
  _approved.push('.*bandcamp\.com\/');
  _approved.push('.*bandcamp\.com\/track\/.*');
  _approved.push('.*bandcamp\.com\/album\/.*');
  _approved.push('listen\.grooveshark\.com\/s\/.*');
  _approved.push('grooveshark\.com\/s\/.*');
  _approved.push('grooveshark\.com\/#\/.*');
  _approved.push('gist\.github\.com\/.*');
  _approved.push('http(s)?:\/\/foursquare.com/.*');
  _approved.push('twitter\.com\/.*\/status\/.*');
  _approved.push('twitter\.com\/.*\/statuses\/.*');
  _approved.push('www\.twitter\.com\/.*\/status\/.*');
  _approved.push('www\.twitter\.com\/.*\/statuses\/.*');
  _approved.push('mobile\.twitter\.com\/.*\/status\/.*');
  _approved.push('mobile\.twitter\.com\/.*\/statuses\/.*');
  _approved.push('https:\/\/twitter\.com\/.*\/status\/.*');
  _approved.push('https:\/\/twitter\.com\/.*\/statuses\/.*');
  _approved.push('https:\/\/www\.twitter\.com\/.*\/status\/.*');
  _approved.push('https:\/\/www\.twitter\.com\/.*\/statuses\/.*');
  _approved.push('https:\/\/mobile\.twitter\.com\/.*\/status\/.*');
  _approved.push('https:\/\/mobile\.twitter\.com\/.*\/statuses\/.*');
  _approved.push('www\.slideshare\.net\/.*\/.*');
  _approved.push('www\.slideshare\.net\/mobile\/.*\/.*');
  _approved.push('slidesha\.re\/.*');
  _approved.push('.*youtube\.com\/watch.*');
  _approved.push('.*\.youtube\.com\/v\/.*');
    _approved.push('youtu\.be\/.*');
  _approved.push('.*\.youtube\.com\/user\/.*');
  _approved.push('.*\.youtube\.com\/.*#.*\/.*');
  _approved.push('m\.youtube\.com\/watch.*');
  _approved.push('m\.youtube\.com\/index.*');
  _approved.push('.*\.youtube\.com\/profile.*');
  _approved.push('.*\.youtube\.com\/view_play_list.*');
  _approved.push('.*\.youtube\.com\/playlist.*');
  _approved.push('blip\.tv\/file\/.*');
  _approved.push('.*\.blip\.tv\/file\/.*');
  _approved.push('www\.vimeo\.com\/groups\/.*\/videos\/.*');
  _approved.push('www\.vimeo\.com\/.*');
  _approved.push('vimeo\.com\/groups\/.*\/videos\/.*');
  _approved.push('vimeo\.com\/.*');
  _approved.push('vimeo\.com\/m\/#\/.*');
  _approved.push('www\.facebook\.com\/photo\.php.*');
  _approved.push('www\.facebook\.com\/video\/video\.php.*');
  _approved.push('www\.facebook\.com\/v\/.*');

  var c = _approved.join('|');

  this.approved = new RegExp(c);

};

Embedly.prototype.isEmbedable = function(url) {
  return this.approved.test(url);
};

Embedly.prototype.getCode = function(url , callbacks) {

  this.request.get('/oembed?url='+encodeURIComponent(url)+this.requiredParams, {
    onSuccess : function(resp) {
                  console.dir(resp);
                  callbacks.onSuccess(JSON.parse(resp.responseText));
                },
    onFailure : function(resp) {
                  console.dir(resp);
                  callbacks.onFailure();
                }
  });

};
