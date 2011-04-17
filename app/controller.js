var Mikrob = (Mikrob || {});
Mikrob.Controller = (function(){
  var viewport,
      messages,
      inbox,
      notices,
      sidebar = { quote : {}, thread : {}, picture : {}, user : {}, tag : {} },
      sidebar_visible='';


  function setUpBodyCreator() {
    $('#update_form').bind('submit', Mikrob.Events.updateSubmit);
    $('#update_body').bind('keydown',Mikrob.Events.onEnter);
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

    this.sidebar.tag = new ViewPort('sidebar_tag');
    this.sidebar.tag.attachEventListener('click','input',Mikrob.Events.statusListener);
    this.sidebar.tag.attachEventListener('click','a',Mikrob.Events.linkListenerSidebar);
    // bind close event to all sidebars
    ['quote', 'thread', 'picture', 'user', 'tag'].forEach(function(sdb){
      $('#sidebar_'+sdb+' .sidebar_close').bind('click',function close(){ sidebarClose(sdb); });
    });
  }

  function setupMoreForm() {
    $('#remove_picture').hide();
    $('#form_more').bind('click', showMoreForm);
    $('#form_jump').bind('click', showJumpWindow);
    $('#controls .sidebar_close').bind('click', closeMoreForm);
    $('#update_picture').bind('change', function pictureClicked(event){
      $(event.target).css({ display : 'none'});
      $('#remove_picture').css( { display : 'inline'});
    });

    $('#location_button').bind('click',Mikrob.Events.getGeoLocation);
    $('#priv_toggle').bind('click',togglePrivate);
    $('#remove_picture').bind('click',removePicture);
    $('#shorten_links_button').bind('click',shortenLinks);

    $('#single_column_toolbar input' ).live('click', showColumn);

    $('#update_body').bind('focus', function makeSolid() { $('#controls_container').css({opacity : 1}); });
    $('#update_body').bind('blur', function makeTransparent() { $('#controls_container').css({opacity : 0.7}); });

    $('#columnMode').bind('click', toggleColumnMode);

    if(typeof Titanium != 'undefined') $('#location_button').hide();
  }

  function offlineMode(turn_off) {
    if(turn_off) {
      $('#overlay').hide();
      $('#offline').hide();
      Settings.check.canPoll = true;
      $('#controls_container').show();
    } else {
      $('#go_online').bind('click', function goOnlineHandler(){
        Mikrob.Controller.offlineMode(true);
        return false;
      });
      $('#overlay').show();
      $('#offline').show();
      $('#controls_container').hide();
    }
  }


  function setUpCharCounter() {
    var el = $('#update_body_char_count'),
        pt = $('#priv_toggle'),
        sh = $('#shorten_links_button');
    pt.hide();
    sh.hide();

    $('#update_body').bind('keyup focus',function bodyContentTracker(event) {
      var str = event.target.value;
      if(str.match(/^(>)+/)){
        pt.css('display', 'inline');
      } else {
        pt.hide();
      }

      if (str.match(/^(>){1}/)) { pt.html('Sprywatyzuj'); }

      if (str.match(/^(>){2}/)) { pt.html('Upublicznij'); }

      if(str.match(/http/gi)) {
        sh.css('display', 'inline');
      } else {
        sh.hide();
      }

      var length = 160 - str.length;
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
    var ubody = $('#update_body'),
        str = ubody.val(),
        s = "",
        replaced = false;

    if (str.match(/^>{2}/)) { s = str.replace(/^>>/, '>'); replaced = true; }
    if (!replaced && str.match(/^>{1}/))  { s = str.replace(/^>/, '>>'); }

    ubody.val(s);
    ubody.dom[0].focus();

    return false;
  }

  function removePicture(event) {
    event.preventDefault();

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
    $('#oauth_authorize').bind('click', Mikrob.Events.oauthDance);
    $('#login_form form').bind('submit',Mikrob.Events.checkAndSaveCredentials);
    $('#close_login_window').hide();
  }

  function showPreferencesWindow() { $('#overlay').show(); $('#preferences').show(); return false; }

  function hidePreferencesWindow() { $('#overlay').hide(); $('#preferences').hide(); return false; }

  function setUpPreferencesWindow() {
    $('#prefs').bind('click', showPreferencesWindow);
    $('#preferences form').bind('submit', Mikrob.Events.updatePreferences);
    $('#preferences .sidebar_close').bind('click', hidePreferencesWindow);

    $('#close_login_window').hide();
    $('#login_form_open').bind('click',function openLoginHandler(event){
      event.preventDefault();
      $('#close_login_window').show().bind('click', function closeLoginHandler(event){
        event.preventDefault();
        hideLoginWindow();
        return false;
      });

      hidePreferencesWindow();
      showLoginWindow();
      return false;
    });
  }

  function setContents(string, is_prepend, set_focus) {
    var input = $('#update_body'),
        current_val = input.dom[0].value, new_val = "";

    if (is_prepend) {
      new_val = string + " " + current_val;
    } else {
      new_val = current_val + " " + string + " ";
    }
    if(current_val.length === 0) new_val = string + " ";

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

  function fakeEvent(action, data) {
    var data_str = "";
    for(var e in data) { data_str += "data-"+e+"='"+data[e]+"' "; }

    return {
      target : ('<a data-action="'+action+'" '+data_str+' ></a>'),
      preventDefault : function() { return false; }
    };

  }

  function showJumpWindow() {
    var resp = window.prompt('Zasiądź za sterami papierowego szybkolotu!\n^nick - aby zobaczyć informacje o wybranym użytkowniku\n#tag - by otworzyć ostatnie statusy otagowane wybranym tagiem');
    if(resp !== null && resp.length > 0) {
      var _T = resp.split(' ')[0].split('');
      var type = _T.shift(),
          query = _T.join('');
      switch(type) {
        case '^':
          Mikrob.Events.linkListener(fakeEvent('user', { username : query }));
          break;
        case '#':
          Mikrob.Events.linkListener(fakeEvent('tag', { tag: query }));
          break;
        default:
          break;
      }
    }
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

  function showUserInfoBlipi(username, object) {
    object.username = username;
    this.sidebar.user.renderTemplate('blipi_user_info', object, null, $('#'+username+'_user .blipi_info'));
  }


  function showUserStatuses(obj) {
    this.sidebar.user.renderCollection(obj);
  }
  function populateInboxColumns() {

    Mikrob.Service.blipAcc.directed(false, {
      onSuccess : function(resp) {
                    Mikrob.Controller.messages.content.html('');
                    Mikrob.Controller.messages.renderCollection(resp);
                  },
      onFailure : console.dir
    });

    Mikrob.Service.blipAcc['private'](false, {
      onSuccess : function(resp) {
                    Mikrob.Controller.inbox.content.html('');
                    Mikrob.Controller.inbox.renderCollection(resp);
                  },
      onFailure : console.dir
    });
    Mikrob.Service.blipAcc.notices(false, {
      onSuccess : function(resp) {
                    Mikrob.Controller.notices.content.html('');
                    Mikrob.Controller.notices.renderCollection(resp);
                  },
      onFailure : console.dir
    });
  }

  var prevUpdate;
  function toId(resp){
    // btoa can work only on ASCII chars!
    return btoa(resp[0].created_at + resp[0].body.replace(/[^a-z0-9]/gi,''));
  }

  function renderDashboard(resp,is_update) {
      var dash = [], dm = [], pm = [], n = [];

    // check whether previous update isn't the same as the current one
    // if so - abort the whole thing entirely
    if (is_update && prevUpdate == toId(resp)) {
      return false;
    }

    // was different - proceed
    prevUpdate = toId(resp);

    dash = resp.map(function(status){
      if(status.type == 'DirectedMessage') dm.push(status);
      if(status.type == 'PrivateMessage')  pm.push(status);
      if(status.type == 'Notice')          n.push(status);

      return status;
    });

    Mikrob.Controller.viewport.renderCollection(dash,is_update);
    if(dm.length > 0 ) Mikrob.Controller.messages.renderCollection(dm,is_update);
    if(pm.length > 0 ) Mikrob.Controller.inbox.renderCollection(   pm,is_update);
    if(n.length > 0 ) Mikrob.Controller.notices.renderCollection( n,is_update);

    if (is_update) {
      notifyAfterUpdate(resp);
    }

    setTimeout(function(){ this.expandShortlinks(); }.bind(this), 500);

    return true;
  }

  var notified_about = {};
  function notifyAfterUpdate(resp) {
    if(Settings.check.notificationsEnabled) {
      if(resp.length > 5) {
          Mikrob.Notification.create( 'Mikrob', [resp.length, 'nowych blipinięć!'].join(' '), 'assets/mikrob_icon_48.png');
      } else {
        resp.forEach(function(status, index){
          if(! notified_about[status.id] === true) {
            var av = status.user.avatar ? 'http://blip.pl'+status.user.avatar.url_50 : 'assets/mikrob_icon_48.png';
            Mikrob.Notification.create( status.user.login, status.body, av);
            notified_about[status.id] = true;
          }
        });
      }
    }
  }

  function renderThread(discussion) {
    this.sidebar.thread.content.html('');
    this.sidebar.thread.renderCollection(discussion);
    sidebarShow('thread');
  }

  function renderTag(tag, statuses){
    this.sidebar.tag.renderTemplate('tag_mgmt', {tag: tag});
    this.sidebar.tag.renderCollection(statuses);
    sidebarShow('tag');
  }
  function throbberHide() {
    $('#throbber').anim( {opacity : 0}, 0.3, 'ease-out');
  }
  function throbberShow() {
    $('#throbber').anim( {opacity : 1}, 0.3, 'ease-out');
  }

  function removeStatus(id) {
    var coll = $('div[data-blipid="'+id+'"]');
    coll.each(function(i){
      var o = coll.dom[i];
      o.parentNode.removeChild(o);
    });
  }

  function toggleColumnMode(event) {
    var singleMode = $('#cnt').hasClass('SingleColumnMode');
    var el = event.target.tagName == 'A' ? $(event.target).find('img') : $(event.target);
    if(singleMode) {
      el.attr('src', 'assets/single_column_16.png');
      $('#cnt').removeClass('SingleColumnMode');
      $('#single_column_toolbar').hide();
      $('.viewport').show();
    } else {
      el.attr('src', 'assets/multi_column_16.png');
      $('#cnt').addClass('SingleColumnMode');
      $('#single_column_toolbar').css('display', 'inline');
      gotoColumn(event, 'timeline');
    }

    return false;
  }

  function showColumn(event, _name) {
    event.preventDefault();
    var name = _name || $(event.target).data('name');
    $('.viewport').hide();
    $('#'+name).show();
    $('#single_column_toolbar span').dom[0].innerHTML = $(event.target).data('section');
    return false;
  }

  function expandShortlinks() {
    var linkDataCallback = function(element, url) {
      var el = $(element);
      if(url){
        el.attr('href', url);
        el.attr('data-url', url);

        // long urls are long
        var elipsis = url.replace(/http[s]?\:\/\//, '');
        elipsis = elipsis.replace(/^www\./,'');
        elipsis = elipsis.split('').splice(0, 18);
        elipsis.unshift('[');
        elipsis.push('...]');
        elipsis = elipsis.join('');
        el.html(elipsis);
      }
      el.attr('data-action', 'link');
    };

    $('a[data-action="expand"]').each(function(idx, element){
      var id = $(element).attr('href').split('/').reverse()[0];
      Mikrob.Service.shortlinkExpand(id, element, linkDataCallback);
    });
  }

  function shortenLinks(event) {
    event.preventDefault();

    var replaceLink  = function(url, shortened) {
      var body = $('#update_body').val().replace(url, shortened);
      $('#update_body').val(body);

    };
    var r = $('#update_body').val().match(/http(s)?\S+/gi);

    // short circuit
    if(r === null) return false;

    r.forEach(function(url){
      Mikrob.Service.shortlinkCreate(url, replaceLink);
    });

    return false;
  }

  return {
    viewport : viewport,
    inbox : inbox,
    sidebar : sidebar,
    setUpViewports : setUpViewports,
    setUpSidebars : setUpSidebars,
    offlineMode : offlineMode,
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
    showJumpWindow : showJumpWindow,
    closeMoreForm : closeMoreForm,
    showQuotedStatus : showQuotedStatus,
    showUserInfo : showUserInfo,
    showUserInfoBlipi : showUserInfoBlipi,
    showUserStatuses : showUserStatuses,
    populateInboxColumns : populateInboxColumns,
    renderDashboard : renderDashboard,
    throbberHide : throbberHide,
    throbberShow  : throbberShow,
    renderThread : renderThread,
    renderTag : renderTag,
    removeStatus : removeStatus,
    expandShortlinks : expandShortlinks
  };
})();
