/*
 * must adheir to status format:
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
var Status = function(blip_obj, own_username) {
  var status = {};
  // status metadata
  status.type = blip_obj.type;
  status.id = blip_obj.id;
  status.created_at = blip_obj.created_at;
  status.pretty_created_at = PrettyDate(blip_obj.created_at);
  status.transport = blip_obj.transport_description;

  if(blip_obj.user) {
    status.username = blip_obj.user.login || "";
    status.is_own = (blip_obj.user.login == own_username);
    status.user_id = blip_obj.user.id;
    status.user_location = blip_obj.user.location;
    if (blip_obj.user.avatar) {
      status.user_avatar_url = 'http://blip.pl'+blip_obj.user.avatar.url_50;
    } else {
      status.user_avatar_url = 'assets/mikrob_icon_48.png';
    }

  }
  // users

  if (blip_obj.recipient) {
    status.recipientname = blip_obj.recipient.login;
    status.recipient_id = blip_obj.recipient.id;
    status.recipient_location = blip_obj.recipient.location;
    if (blip_obj.recipient.avatar) {
      status.recipient_avatar_url = 'http://blip.pl'+blip_obj.recipient.avatar.url_50;
    } else {
      status.recipient_avatar_url = 'assets/mikrob_icon_48.png';
    }
  }


  // pictures storage
  if (blip_obj.pictures && blip_obj.pictures.length > 0) {
    // take first pic - blip doesn't allow uploading more than one
    // unless it's an mms, and nobody sends them anyway
    status.picture = blip_obj.pictures[0].url;
    status.picture_thumb = status.picture.replace(".jpg","_inmsg.jpg");
  }
  status.orig_body = blip_obj.body;

  var getShortType = function(blip_obj) {
    var type = "s",
        msg_arrow = "";

    switch(blip_obj.type) {
      case 'Status':
        type = "s";
        break;
      case 'DirectedMessage':
        type = "dm";
        msg_arrow = ">";
        break;
      case 'PrivateMessage':
        type = 'pm';
        msg_arrow = ">>";
        break;
      default:
        break;
    }
    return { type : type, msg_arrow : msg_arrow };
  };
  var getMessageString = function(type, username) {
    var message_string = [">", username];
    if(type == 'PrivateMessage' ) message_string.unshift('>');
    return message_string.join('');
  };


  var o = getShortType(blip_obj);
  // useful for templates and actions
  status.blip_url = "http://blip.pl/"+o.type+"/"+status.id;
  status.msg_arrow = o.msg_arrow;
  status.message_string = getMessageString(status.type, status.username);
  status.body = BodyParser.parse(blip_obj.body);

  return status;

};
