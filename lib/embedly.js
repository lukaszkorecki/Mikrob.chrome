var Embedly = function() {
  this.request = new Request('http://api.embed.ly/1');
  this.requiredParams = "&maxwidth=600&format=json";
  this.approved = new RegExp([
    'http:\/\/(www\.)?flickr\.com\/photos\/.*',
    'flic\.kr\/.*',
    '.*imgur\.com\/.*',
    '.*dribbble\.com\/shots\/.*',
    'drbl\.in\/.*',
    'picasaweb\.google\.com.*\/.*\/.*#.*',
    'picasaweb\.google\.com.*\/lh\/photo\/.*',
    'picasaweb\.google\.com.*\/.*\/.*',
    'instagr\.am\/p\/.*',
    'instagram\.com\/p\/.*',
    'skitch\.com\/.*\/.*\/.*',
    'img\.skitch\.com\/.*',
    'https:\/\/skitch\.com\/.*\/.*\/.*',
    'https:\/\/img\.skitch\.com\/.*',
    'picplz\.com\/user\/.*\/pic\/.*\/',
    'soundcloud\.com\/.*',
    'soundcloud\.com\/.*\/.*',
    'soundcloud\.com\/.*\/sets\/.*',
    'soundcloud\.com\/groups\/.*',
    'snd\.sc\/.*',
    'last\.fm\/music\/.*',
    'last\.fm\/music\/+videos\/.*',
    'last\.fm\/music\/+images\/.*',
    'last\.fm\/music\/.*\/_\/.*',
    'last\.fm\/music\/.*\/.*',
    '.*bandcamp\.com\/',
    '.*bandcamp\.com\/track\/.*',
    '.*bandcamp\.com\/album\/.*',
    'listen\.grooveshark\.com\/s\/.*',
    'grooveshark\.com\/s\/.*',
    'grooveshark\.com\/#\/.*',
    'gist\.github\.com\/.*',
    'http(s)?:\/\/foursquare.com/.*',
    'twitter\.com\/.*\/status\/.*',
    'twitter\.com\/.*\/statuses\/.*',
    'www\.twitter\.com\/.*\/status\/.*',
    'www\.twitter\.com\/.*\/statuses\/.*',
    'mobile\.twitter\.com\/.*\/status\/.*',
    'mobile\.twitter\.com\/.*\/statuses\/.*',
    'https:\/\/twitter\.com\/.*\/status\/.*',
    'https:\/\/twitter\.com\/.*\/statuses\/.*',
    'https:\/\/www\.twitter\.com\/.*\/status\/.*',
    'https:\/\/www\.twitter\.com\/.*\/statuses\/.*',
    'https:\/\/mobile\.twitter\.com\/.*\/status\/.*',
    'https:\/\/mobile\.twitter\.com\/.*\/statuses\/.*',
    'www\.slideshare\.net\/.*\/.*',
    'www\.slideshare\.net\/mobile\/.*\/.*',
    'slidesha\.re\/.*',
    '.*youtube\.com\/watch.*',
    '.*\.youtube\.com\/v\/.*',
      'youtu\.be\/.*',
    '.*\.youtube\.com\/user\/.*',
    '.*\.youtube\.com\/.*#.*\/.*',
    'm\.youtube\.com\/watch.*',
    'm\.youtube\.com\/index.*',
    '.*\.youtube\.com\/profile.*',
    '.*\.youtube\.com\/view_play_list.*',
    '.*\.youtube\.com\/playlist.*',
    'blip\.tv\/file\/.*',
    '.*\.blip\.tv\/file\/.*',
    'www\.vimeo\.com\/groups\/.*\/videos\/.*',
    'www\.vimeo\.com\/.*',
    'vimeo\.com\/groups\/.*\/videos\/.*',
    'vimeo\.com\/.*',
    'vimeo\.com\/m\/#\/.*',
    'www\.facebook\.com\/photo\.php.*',
    'www\.facebook\.com\/video\/video\.php.*',
    'www\.facebook\.com\/v\/.*'
  ].join('|'));

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
