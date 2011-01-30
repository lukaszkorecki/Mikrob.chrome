var Mikrob = (Mikrob || {});
Mikrob.Service = (function(){
  var blipAcc, last_id;

  function loadDashboard(blip,viewport, callbackAfter) {
    this.blipAcc = blip;
    this.blipAcc.getDashboard(false,{
      onSuccess : function(resp) {
        if(resp.length > 0) {
          resp.forEach(function(stat){ App.statusStore.store(stat.id, stat); });
          Mikrob.Controller.renderDashboard(resp, false);
          last_id = resp[0].id;
          callbackAfter();
        }
      },
      onFailure : function(resp) {
        Mikrob.Notification.create("Błąd", 'Wystąpił błąd podczas ładowania kokpitu');
        console.dir(resp);
      }
    });
  }

  function updateDashboard(viewport) {
    Mikrob.Controller.throbberShow();

    this.blipAcc.getDashboard(last_id, {
      onSuccess : function(resp) {
        if(resp.length > 0) {
          // cache
          resp.forEach(function(stat){ App.statusStore.store(stat.id, stat); });

          Mikrob.Controller.renderDashboard(resp,true);
          last_id = resp[0].id;
          Mikrob.Controller.throbberHide();
        }
      },
      onFailure : function(resp) {
        Mikrob.Notification.create("Błąd", 'Wystąpił błąd podczas pobierania kokpitu');
        console.dir(resp);
        Mikrob.Controller.throbberHide();
      }
    });
  }

  function createStatus(body, file, callbacks) {
    this.blipAcc.createStatus(body,file, callbacks);
  }
  function getSingleStatus(id,callbacks) {
    var single = App.statusStore.get(id);
    if(single) {
      callbacks.onSuccess(single);
    } else {
      this.blipAcc.getStatus(id, callbacks);
    }
  }

  function getUserInfo(username,callbacks) {
    // FIXME no caching yet!
    this.blipAcc.userInfo(username, callbacks);
  }

  function getGeoLocation() {
    navigator.geolocation.getCurrentPosition(function(geo){
      // blip style geo
      var str = ["@/", geo.coords.latitude, ',', geo.coords.longitude, '/'].join('');
      Mikrob.Controller.throbberHide();
      Mikrob.Controller.setContents(str,false, true);

    });

  }

  return {
    blipAcc : blipAcc,
    loadDashboard : loadDashboard,
    updateDashboard : updateDashboard,
    createStatus : createStatus,
    getSingleStatus : getSingleStatus,
    getUserInfo : getUserInfo,
    getGeoLocation : getGeoLocation
  };
})();
