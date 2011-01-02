var Mikrob = (Mikrob || {});
Mikrob.View = (function(){
  var viewport, sidebar;

  function setUpCharCounter() {
    $('#update_body').bind('keyup focus',function(event) {
      $('#update_body_char_count').html(event.target.value.length);
    });
  }

  function setUpBodyCreator() {
    $('#update_form').bind('submit', Mikrob.Events.updateSubmit);
  }

  function setUpTimeline(id) {
    this.viewport = new ViewPort(id);
    this.viewport.attachEventListener('click','input',Mikrob.Events.statusListener);
    this.viewport.attachEventListener('click','a',Mikrob.Events.linkListener);
  }

  function setUpSidebar() {
    this.sidebar = new ViewPort('sidebar');
    this.sidebar.attachEventListener('click','a',Mikrob.Events.linkListenerSidebar);
  }

  function setContents(string, is_prepend, set_focus) {
    var input = $('#update_body');
    var current_val = input.dom[0].value, new_val = "";
    if (is_prepend) {
      new_val = string + " "+current_val;
    } else {
      new_val = current_val + " "+string;
    }

    input.dom[0].value =  new_val;

    if (set_focus) {
      input.dom[0].focus();
      input.dom[0].setSelectionRange(new_val.length, new_val.length);
    }

  }

  function disableForm(target) {
    $(target).find('input').each(function(el){
      $(el).attr('disabled','disabled');
    });
  }
  function enableForm(target, clear) {
    $(target).find('input').each(function(el){
      $(el).dom[0].removeAttribute('disabled');
    });
    var up = $('#update_body').dom[0];
    if(clear) {
      up.value = "";
    }
    up.blur();
    up.focus();
  }

  // sidebar stuff
  function sidebarShow() {
    $('#sidebar').anim({ translate : '120%,0%'}, 1, 'ease-out');
  }
  function sidebarClose() {
    $('#sidebar').anim({ translate : '0%,0%'}, 1, 'ease-out');
  }
  function setSidebarContent(html) {
    $('#sidebar').html(html);
  }

  // show quoted status
  function showQuotedStatus(obj,is_append) {
    this.sidebar.renderSingle(obj,is_append);
  }
  return {
    viewport : viewport,
    sidebar : sidebar,
    setUpTimeline : setUpTimeline,
    setUpSidebar : setUpSidebar,
    setContents : setContents,
    setUpCharCounter : setUpCharCounter,
    setUpBodyCreator : setUpBodyCreator,
    enableForm : enableForm,
    disableForm : disableForm,
    sidebarShow : sidebarShow,
    sidebarClose : sidebarClose,
    setSidebarContent : setSidebarContent,
    showQuotedStatus : showQuotedStatus
  };
})();
