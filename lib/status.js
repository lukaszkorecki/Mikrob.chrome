/*
 * must adheir to this format:
 * {
 * user : username,
 * type : type,
 * blip_url : blip_url.
 * id : blip_id,
 * user_avatar_url : url,
 * recipient_avatar_url : url,
 * body : html_body,
 * is_own : true|false
 * }
 */
var Status = function(blip_obj) {
  // original object
  this.blip_obj = blip_obj;
  // status metadata
  this.type = blip_obj.type;
  this.id = blip_obj.id;
  this.created_at = blip_obj.created_at;
  this.transport = blip_obj.transport_description;

  // users
  this.username = blip_obj.user.login;
  this.user_id = blip_obj.user.id;
  this.user_location = blip_obj.user.location;
  if (blip_obj.user.avatar) {
    this.user_avatar_url = 'http://blip.pl'+blip_obj.user.avatar.url_50;
  }

  if (blip_obj.recipient) {
    this.recipientname = blip_obj.recipient.login;
    this.recipient_id = blip_obj.recipient.id;
    this.recipient_location = blip_obj.recipient.location;
    if (blip_obj.recipient.avatar) {
      this.recipient_avatar_url = 'http://blip.pl'+blip_obj.recipient.avatar.url_50;
    }
  }

  // useful for templates and actions
  this.blip_url = "http://blip.pl/"+this.getShortType()+"/"+this.id;
  this.message_string = this.getMessageString(this.type, this.username);

  // pictures storage
  // FIXME this is not that simple tho
  if (blip_obj.pictures && blip_obj.pictures.length > 0) {
    this.picture = blip_obj.pictures;
  }
  this.body = this.parseBody(blip_obj.body);
};

Status.prototype.getShortType = function() {
  var type = "u";
  switch(this.type) {
    case 'Status':
      type = "s";
      break;
    case 'DirectedMessage':
      type = "dm";
      break;
    case 'PrivateMessage':
      type = 'pm';
      break;
    default:
      break;
  }
  return type;
};
Status.prototype.getMessageString = function(type, username) {
  var message_string = ">";
  if (type == 'PrivateMessage') {
    message_string += ">";
  }
  return message_string + username;
};

Status.prototype.parseBody = function(orig_body) {
  var body = orig_body;
  body = body.replace('&', '&amp;').replace(/\>/gi, '&gt;').replace(/\</gi, '&lt;') ;
  body = BodyParser.justLink(body);
  body = BodyParser.userLink(body, "blip.pl/users");
  body = BodyParser.tagLink(body, "blip.pl/tags");
  return body;

};
