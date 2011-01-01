var Mikrob = (Mikrob || {});
Mikrob.View = (function(){
  var viewport;

  function setUpTimeline(id) {
    this.viewport = new ViewPort(id);
    this.viewport.attachEventListener('click','a', function(event){
      console.dir(event.target);
      return false;
    });
  }

  return {
    setUpTimeline : setUpTimeline,
    viewport : viewport
  };
})();
