var Mikrob = (Mikrob || {});
Mikrob.Controller = (function(){
  var viewport,
      messages,
      inbox,
      notices,
      sidebar = { quote : {}, thread : {}, picture : {}, user : {} },
      sidebar_visible='';


  function setUpBodyCreator() {
    $('#update_form').bind('submit', Mikrob.Events.updateSubmit);
  }

  function setUpViewports() {

    // TODO make it more concise and shorter
    // too much repetetive code
    // main timeline
    //
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
    // FIXME to much repetition
    this.sidebar.quote = new ViewPort('sidebar_quote');
    this.sidebar.quote.attachEventListener('click','a',Mikrob.Events.linkListenerSidebar);
    this.sidebar.quote.attachEventListener('click','input',Mikrob.Events.statusListener);

    this.sidebar.picture = new ViewPort('sidebar_picture');
    this.sidebar.picture.attachEventListener('click','a',Mikrob.Events.linkListenerSidebar);

    this.sidebar.user = new ViewPort('sidebar_user');
    this.sidebar.user.attachEventListener('click','input',Mikrob.Events.statusListener);
    this.sidebar.user.attachEventListener('click','a',Mikrob.Events.linkListenerSidebar);

    this.sidebar.thread = new ViewPort('sidebar_thread');
    this.sidebar.thread.attachEventListener('click','input',Mikrob.Events.statusListener);
    this.sidebar.thread.attachEventListener('click','a',Mikrob.Events.linkListenerSidebar);

    // bind close event to all sidebars
    ['quote', 'thread', 'picture', 'user'].forEach(function(sdb){
      $('#sidebar_'+sdb+' .sidebar_close').bind('click',function(){ sidebarClose(sdb); });
    });
  }

  function setupMoreForm() {
    $('#remove_picture').hide();
    $('#form_more').bind('click', showMoreForm);
    $('#controls .sidebar_close').bind('click', closeMoreForm);
    $('#update_picture').bind('change',function(event){
      $(event.target).css({ display : 'none'});
      $('#remove_picture').css( { display : 'inline'});
    });
    $('#location_button').bind('click',Mikrob.Events.getGeoLocation);
    $('#priv_toggle').bind('click',togglePrivate);
    $('#remove_picture').bind('click',removePicture);

    $('#update_body').bind('focus', function() { $('#controls_container').css({opacity : 1}); });
    $('#update_body').bind('blur', function() { $('#controls_container').css({opacity : 0.7}); });
  }

  function setUpCharCounter() {
    var el = $('#update_body_char_count');
    $('#update_body').bind('keyup focus',function(event) {
      if (event.target.value.match(/^>{1}/)) {
        $('#priv_toggle span').html('Sprywatyzuj');
      }

      if (event.target.value.match(/^>{2}/)) {
        $('#priv_toggle span').html('Upublicznij');
      }

      var length = 160 - event.target.value.length;
      el.html(length);
      if(length < 0 && !(el.hasClass('warning'))) {
        el.addClass('warning');
      } else if(el.hasClass('warning') && length >= 0) {
        el.removeClass('warning');
      }
    });
  }

  function togglePrivate(event) {
    event.preventDefault();
    var str = $('#update_body').val(), s = "", replaced = false;
    if (str.match(/^>{2}/)) { s = str.replace(/^>>/, '>'); replaced = true; }
    if (str.match(/^>{1}/) && !replaced)  { s = str.replace(/^>/, '>>'); }
    console.log(str);
    console.log(s);
    $('#update_body').val(s);

    return false;
  }

  function removePicture(event) {
    event.preventDefault();
    console.dir(event);

    var str = $('#update_body').dom[0].value;
    $('#update_form').dom[0].reset();
    $('#update_body').dom[0].value = str;

    $(event.target).css({ display : 'none'});
    $('#update_picture').css( { display : 'inline'});
    return false;
  }

  function showLoginWindow() { $('#overlay').show(); $('#login_form').show(); }

  function hideLoginWindow() { $('#overlay').hide(); $('#login_form').hide(); }


  function setUpLoginWindow() {
    $('#login_form form').bind('submit',Mikrob.Events.checkAndSaveCredentials);
  }

  function showPreferencesWindow() { $('#overlay').show(); $('#preferences').show(); return false; }

  function hidePreferencesWindow() { $('#overlay').hide(); $('#preferences').hide(); return false; }

  function setUpPreferencesWindow() {
    $('#preferences form').bind('submit', Mikrob.Events.updatePreferences);
    $('#preferences .sidebar_close').bind('click', hidePreferencesWindow);
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
    $('#' + target + ' input').each(function(i, el){
      $(el).attr('disabled','disabled');
    });
  }
  function enableForm(target, clear) {
    $('#' + target + ' input').each(function(i, el){
      $(el).removeAttr('disabled');
    });
    var up = $('#update_body').dom[0];
    if(clear) {
      up.value = "";
    }
    up.blur();
    up.focus();
  }

  function resetFormPicture() {
    var body = $('#update_body').dom[0].value;
    $('#update_form').dom[0].reset();
    $('#update_body').dom[0].value = body;
  }

  // sidebar stuff
  function sidebarShow(id) {
    if(sidebar_visible !== '') {
      sidebarClose(sidebar_visible);
    }
    $('#sidebar_'+id).anim({ translate : '195%,0%', opacity : 1}, 1, 'ease-out');
    sidebar_visible = id;
  }
  function sidebarClose(id) {
    $('#sidebar_'+id).anim({ translate : '-100%,0%', opacity : 0}, 1, 'ease-out');
    sidebar_visible = '';
  }

  function showMoreForm() {
    $('#controls').show();
    $('#update_body').dom[0].focus();
  }

  function closeMoreForm() {
    $('#controls').hide();
  }

  // show quoted status
  function showQuotedStatus(obj,is_append) {
    this.sidebar.quote.renderSingle(obj,is_append);
  }

  function showUserInfo(obj) {
    var usr = new User(obj);
    this.sidebar.user.renderTemplate('user',usr);
  }


  function showUserStatuses(obj) {
    this.sidebar.user.renderCollection(obj);
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
      pm : [],
      n : []
    };
    resp.forEach(function(status){
      switch(status.type) {
        case 'DirectedMessage':
          sorted.dm.push(status);
          break;
        case 'PrivateMessage':
          sorted.pm.push(status);
          break;
        // XXX we let it fall through so it gets rendered twice
        case 'Notice':
          sorted.n.push(status);
        default:
          sorted.dash.push(status);
      }
    });

    Mikrob.Controller.viewport.renderCollection(sorted.dash,is_update);
    Mikrob.Controller.messages.renderCollection(sorted.dm,is_update);
    Mikrob.Controller.inbox.renderCollection(sorted.pm,is_update);
    Mikrob.Controller.notices.renderCollection(sorted.n,is_update);
    if (is_update) {
      notifyAfterUpdate(resp);
    }
  }

  function notifyAfterUpdate(resp) {
    resp.forEach(function(status, index){
      // TODO needs implmenting when prefs stuf is in place
      if (true || Mikrob.Settings.notificationsEnabled(status.type) == true) {
        var av = status.user.avatar ? 'http://blip.pl'+status.user.avatar.url_50 : 'assets/mikrob_icon_48.png';
        Mikrob.Notification.create( status.user.login, status.body, av);
      }
    });
  }

  function renderThread(discussion) {
    this.sidebar.thread.renderCollection(discussion);
    sidebarShow('thread');
  }

  function throbberHide() {
    $('#throbber').hide();
  }
  function throbberShow() {
    $('#throbber').show();
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
    setUpPreferencesWindow : setUpPreferencesWindow,
    showPreferencesWindow : showPreferencesWindow,
    hidePreferencesWindow : hidePreferencesWindow,
    setUpCharCounter : setUpCharCounter,
    setUpBodyCreator : setUpBodyCreator,
    setupMoreForm : setupMoreForm,
    enableForm : enableForm,
    disableForm : disableForm,
    resetFormPicture : resetFormPicture,
    sidebarShow : sidebarShow,
    sidebarClose : sidebarClose,
    showMoreForm : showMoreForm,
    closeMoreForm : closeMoreForm,
    showQuotedStatus : showQuotedStatus,
    showUserInfo : showUserInfo,
    showUserStatuses : showUserStatuses,
    populateInboxColumns : populateInboxColumns,
    renderDashboard : renderDashboard,
    throbberHide : throbberHide,
    throbberShow  : throbberShow,
    renderThread : renderThread

  };
})();
