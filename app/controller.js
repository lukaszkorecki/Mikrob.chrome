var Mikrob = (Mikrob || {});
Mikrob.Controller = (function(){
  var viewport, inbox, sidebar = { quote : {}, thread : {}, picture : {}, user : {} }, sidebar_visible='';

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

  function setUpInbox() {
    this.inbox = new ViewPort('inbox');
    this.inbox.attachEventListener('click','input',Mikrob.Events.statusListener);
    this.inbox.attachEventListener('click','a',Mikrob.Events.linkListener);
    this.inbox.attachEventListener('click','div.blip', Mikrob.Events.setActive);
  }

  function setUpSidebar() {
    this.sidebar.quote = new ViewPort('sidebar_quote .sidebar_content');
    this.sidebar.quote.attachEventListener('click','a',Mikrob.Events.linkListenerSidebar);
    this.sidebar.quote.attachEventListener('click','input',Mikrob.Events.statusListener);

    this.sidebar.picture = new ViewPort('sidebar_picture .sidebar_content');
    this.sidebar.picture.attachEventListener('click','a',Mikrob.Events.linkListenerSidebar);

    this.sidebar.user = new ViewPort('sidebar_user .sidebar_content');
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

  function showUserInfo(obj) {
    var usr = new User(obj);
    var stat = obj.current_status;
    stat.user = obj;
    stat.type = "Notice"; // XXX hack
    this.sidebar.user.renderTemplate('user',usr);
    this.sidebar.user.renderSingle(stat,true);
  }

  function generateInbox(update) {
    // the generic callback returns standard
    // callback functions and at the same time stores
    // last (most recent) id of a given inbox type
    // and caches retreived blips
    var callbacks = function(name){
      return {
        onSuccess : function(response) {
                      if(response.length > 0) {
                        console.dir(response);
                        // store last (most recent) id of given type
                        App.messagesIds.store(name,response[0].id);

                        // get all ids for later retreival
                        var ids = response.map(function(el){
                          return el.id;
                        });

                        // store the list
                        // and update it if needed
                        var current = App.messagesStore.get(name) || [];
                        App.messagesStore.store(name, current.concat(ids));

                        // message caching takes place when they're rendered
                        // Mikrob.Controller.renderInbox();
                      }
                    },
        onFailure : console.dir
      };
    };

    if(update) {
      var notices_since = App.messagesIds.get('notices') || false;
      var private_since = App.messagesIds.get('private') || false;
      var directed_since = App.messagesIds.get('directed') || false;
    }

    // get all types of inbox stuff
    // in order to not make your CPU explode
    // some of the calls need to be delayed
    /*jsl:ignore*/
    Mikrob.Service.blipAcc.private(private_since, callbacks('private'));
    /*jsl:end*/

    setTimeout(function(){
      Mikrob.Service.blipAcc.directed(directed_since,callbacks('directed'));
    }, 750);

    setTimeout(function(){
      Mikrob.Service.blipAcc.notices(notices_since,callbacks('notices'));
    }, 1200);

  }

  function updateInbox() {
    generateInbox(true);

  }
  return {
    viewport : viewport,
    inbox : inbox,
    sidebar : sidebar,
    setUpTimeline : setUpTimeline,
    setUpInbox : setUpInbox,
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
    showUserInfo : showUserInfo,
    generateInbox : generateInbox,
    updateInbox : updateInbox
  };
})();
