var Mikrob = (Mikrob || {});
Mikrob.Controller = (function(){
  var viewport, sidebar = { quote : {}, thread : {}, picture : {} }, sidebar_visible='';

  function setLoggedName(name) {
    $('#logged_as span').html(name);
  }
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
    this.viewport.attachEventListener('click','div.blip', Mikrob.Events.setActive);
  }

  function setUpSidebar() {
    this.sidebar.quote = new ViewPort('sidebar_quote .sidebar_content');
    this.sidebar.quote.attachEventListener('click','a',Mikrob.Events.linkListenerSidebar);
    this.sidebar.quote.attachEventListener('click','input',Mikrob.Events.statusListener);

    this.sidebar.picture = new ViewPort('sidebar_picture .sidebar_content');
    this.sidebar.picture.attachEventListener('click','a',Mikrob.Events.linkListenerSidebar);

    // bind close event to all sidebars
    ['quote', 'thread', 'picture'].forEach(function(sdb){
      $('#sidebar_'+sdb+' .sidebar_close').bind('click',function(){ sidebarClose(sdb); });
    });
  }

  function showLoginWindow() { $('#overlay').show(); $('#login_form').show(); }

  function hideLoginWindow() { $('#overlay').hide(); $('#login_form').hide(); }
  function setUpLoginWindow() {
    $('#login_form form').bind('submit',Mikrob.Events.checkAndSaveCredentials);
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
  function sidebarShow(id) {
    if(sidebar_visible !== '') {
      sidebarClose(sidebar_visible);
    }
    $('#sidebar_'+id).anim({ translate : '120%,0%', opacity : 1}, 1, 'ease-out');
    sidebar_visible = id;
  }
  function sidebarClose(id) {
    $('#sidebar_'+id).anim({ translate : '0%,0%', opacity : 0}, 1, 'ease-out');
    sidebar_visible = '';
  }

  // show quoted status
  function showQuotedStatus(obj,is_append) {
    this.sidebar.quote.renderSingle(obj,is_append);
  }
  return {
    viewport : viewport,
    sidebar : sidebar,
    setUpTimeline : setUpTimeline,
    setUpSidebar : setUpSidebar,
    setContents : setContents,
    setUpLoginWindow : setUpLoginWindow,
    showLoginWindow : showLoginWindow,
    hideLoginWindow : hideLoginWindow,
    setUpCharCounter : setUpCharCounter,
    setUpBodyCreator : setUpBodyCreator,
    enableForm : enableForm,
    disableForm : disableForm,
    sidebarShow : sidebarShow,
    sidebarClose : sidebarClose,
    showQuotedStatus : showQuotedStatus,
    setLoggedName : setLoggedName,

  };
})();
