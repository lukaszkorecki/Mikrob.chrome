var User = function(obj) {
  this.username = obj.login;
  this.user_location = obj.location;
  if(this.user_location) {
    var enc = encodeURI(this.user_location),
        loc = ["http://maps.google.com/maps/api/staticmap?zoom=12&size=120x120&sensor=true&markers=size:tiny:color:red|"];

    loc.push(enc);
    loc.push("&center=");
    loc.push(enc);

    this.location_url = loc.join('');
  }
  if(obj.avatar) {
    this.user_avatar = "http://blip.pl"+obj.avatar.url_120;
  }
};
