var Mikrob = (Mikrob || {});
Mikrob.Controller = (function(){
  var viewport,messages, inbox, notices, sidebar = { quote : {}, thread : {}, picture : {}, user : {} }, sidebar_visible='';

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

  function setUpViewports() {

    // main timeline
    this.viewport = new ViewPort('timeline');
    this.viewport.attachEventListener('click','input',Mikrob.Events.statusListener);
    this.viewport.attachEventListener('click','a',Mikrob.Events.linkListener);
    this.viewport.attachEventListener('click','div.blip', Mikrob.Events.setActive);

    // directed messages
    this.inbox = new ViewPort('inbox');
    this.inbox.attachEventListener('click','input',Mikrob.Events.statusListener);
    this.inbox.attachEventListener('click','a',Mikrob.Events.linkListener);
    this.inbox.attachEventListener('click','div.blip', Mikrob.Events.setActive);

    // private messages
    this.messages = new ViewPort('messages');
    this.messages.attachEventListener('click','input',Mikrob.Events.statusListener);
    this.messages.attachEventListener('click','a',Mikrob.Events.linkListener);
    this.messages.attachEventListener('click','div.blip', Mikrob.Events.setActive);

    // notices
    this.notices = new ViewPort('notices');
    this.notices.attachEventListener('click','input',Mikrob.Events.statusListener);
    this.notices.attachEventListener('click','a',Mikrob.Events.linkListener);
    this.notices.attachEventListener('click','div.blip', Mikrob.Events.setActive);
  }

  function setUpSidebars() {
    this.sidebar.quote = new ViewPort('sidebar_quote');
    this.sidebar.quote.attachEventListener('click','a',Mikrob.Events.linkListenerSidebar);
    this.sidebar.quote.attachEventListener('click','input',Mikrob.Events.statusListener);

    this.sidebar.picture = new ViewPort('sidebar_picture');
    this.sidebar.picture.attachEventListener('click','a',Mikrob.Events.linkListenerSidebar);

    this.sidebar.user = new ViewPort('sidebar_user');
    this.sidebar.quote.attachEventListener('click','input',Mikrob.Events.statusListener);

    // bind close event to all sidebars
    ['quote', 'thread', 'picture', 'user'].forEach(function(sdb){
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
    $('#sidebar_'+id).anim({ translate : '115%,0%', opacity : 1}, 1, 'ease-out');
    sidebar_visible = id;
  }
  function sidebarClose(id) {
    $('#sidebar_'+id).anim({ translate : '-115%,0%', opacity : 0}, 1, 'ease-out');
    sidebar_visible = '';
  }

  // show quoted status
  function showQuotedStatus(obj,is_append) {
    this.sidebar.quote.renderSingle(obj,is_append);
  }

  function showUserInfo(obj) {
    var usr = new User(obj);
    var stat = obj.current_status;
    stat.user = obj;
    stat.type = "Notice"; // XXX hack
    this.sidebar.user.renderTemplate('user',usr);
    this.sidebar.user.renderSingle(stat,true);
  }

  function populateInboxColumns() {

    Mikrob.Service.blipAcc.directed(false, {
      onSuccess : function(resp) {
                    Mikrob.Controller.messages.renderCollection(resp);
                  },
      onFailure : console.dir
    });

    Mikrob.Service.blipAcc.private(false, {
      onSuccess : function(resp) {
                    Mikrob.Controller.inbox.renderCollection(resp);
                  },
      onFailure : console.dir
    });
    Mikrob.Service.blipAcc.notices(false, {
      onSuccess : function(resp) {
                    Mikrob.Controller.notices.renderCollection(resp);
                  },
      onFailure : console.dir
    });
  }

  function renderDashboard(resp,is_update) {
    var sorted = {
      dash : [],
      dm : [],
      pm : []
    };
    resp.forEach(function(status){
      console.log(status.type);
      switch(status.type) {
        case 'DirectedMessage':
          sorted.dm.push(status);
          break;
        case 'PrivateMessage':
          sorted.pm.push(status);
          break;
        default:
          sorted.dash.push(status);
      }
    });

    Mikrob.Controller.viewport.renderCollection(sorted.dash,is_update);
    Mikrob.Controller.messages.renderCollection(sorted.dm,is_update);
    Mikrob.Controller.inbox.renderCollection(sorted.pm,is_update);
  }

  return {
    viewport : viewport,
    inbox : inbox,
    sidebar : sidebar,
    setUpViewports : setUpViewports,
    setUpSidebars : setUpSidebars,
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
    showUserInfo : showUserInfo,
    populateInboxColumns : populateInboxColumns,
    renderDashboard : renderDashboard

  };
})();
