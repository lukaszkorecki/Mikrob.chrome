$(document).ready(function(){
  Mikrob.View.setUpTimeline('timeline');
  Mikrob.View.setUpSidebar('sidebar');
  // FIXME these should belong to a controller or event
  Mikrob.View.setUpCharCounter();
  Mikrob.View.setUpBodyCreator();

  var user = Mikrob.User.getCredentials();
  var blip = false;

  if(user.username && user.password) {
    blip = new Blip(user.username, user.password);
  }
  // FIXME | TODO add verification step!

  if(blip) {
    Mikrob.Service.loadDashboard(blip, Mikrob.View.viewport);

    if(blip) {
      setInterval(function(){
        ///console.log('Updating', (new Date()));
        Mikrob.Service.updateDashboard(Mikrob.View.viewport);
      }, 10000);
    }
  }
});
