var Mikrob = (Mikrob || {});
Mikrob.Service = (function(){
  var blipAcc, last_id ;

  function loadDashboard(blip,viewport) {
    this.blipAcc = blip;
    this.blipAcc.getDashboard(false,{
      onSuccess : function(resp) {
        viewport.renderCollection(resp);
        last_id = resp[0].id;
      },
      onFailure : function(resp) {
        console.dir(resp);
      }
    });
  }

  function updateDashboard(viewport) {
    this.blipAcc.getDashboard(last_id, {
      onSuccess : function(resp) {
        if(resp.length > 0) {
          viewport.renderCollection(resp,true);
          last_id = resp[0].id;
        }
      },
      onFailure : function(resp) {
        console.dir(resp);
      }
    });
  }

  function createStatus(body) {
    this.blipAcc.createStatus(body,{
      onFailure : function() {
        alert('booooo');
      },
      onSuccess : function() {
        this.updateDashboard(Mikrob.View.viewport);
      }.bind(this)
    });
  }

  return {
    blipAcc : blipAcc,
    loadDashboard : loadDashboard,
    updateDashboard : updateDashboard,
    createStatus : createStatus
  };
})();
