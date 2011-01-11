var Mikrob = (Mikrob || {});
Mikrob.Service = (function(){
  var blipAcc, last_id;

  function loadDashboard(blip,viewport) {
    this.blipAcc = blip;
    this.blipAcc.getDashboard(false,{
      onSuccess : function(resp) {
        if(resp.length > 0) {
          resp.forEach(function(stat){ App.statusStore.store(stat.id, stat)});
          viewport.renderCollection(resp);
          last_id = resp[0].id;
        }
      },
      onFailure : function(resp) {
        Mikrob.Notification.create("Błąd", 'Wystąpił błąd podczas ładowania kokpitu')
      }
    });
  }

  function updateDashboard(viewport) {
    this.blipAcc.getDashboard(last_id, {
      onSuccess : function(resp) {
        if(resp.length > 0) {
          // cache
          resp.forEach(function(stat){ App.statusStore.store(stat.id, stat)});

          viewport.renderCollection(resp,true);
          last_id = resp[0].id;
        }
      },
      onFailure : function(resp) {
        Mikrob.Notification.create("Błąd", 'Wystąpił błąd podczas pobierania kokpitu')
      }
    });
  }

  function createStatus(body, callbacks) {
    this.blipAcc.createStatus(body,callbacks);
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

  return {
    blipAcc : blipAcc,
    loadDashboard : loadDashboard,
    updateDashboard : updateDashboard,
    createStatus : createStatus,
    getSingleStatus : getSingleStatus,
    getUserInfo : getUserInfo
  };
})();
