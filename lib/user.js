var User = function(obj) {
  this.username = obj.login;
  this.user_location = obj.location;
  if(this.user_location) {
    this.location_url = "http://maps.google.com/maps/api/staticmap?center="+encodeURI(this.user_location)+"&zoom=14&size=120x120&sensor=true";
  }
  if(obj.avatar) {
    this.user_avatar = "http://blip.pl"+obj.avatar.url_120;
  }
};
