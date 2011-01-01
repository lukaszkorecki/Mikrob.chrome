var Mikrob = (Mikrob || {});
Mikrob.View = (function(){
  var viewport;

  function setUpCharCounter() {
    function count(event) {
      console.log(event);
      $('#update_body_char_count').html(event.target.value.length);
    }
    $('#update_body').bind('keyup focus',count);
  }

  function setUpBodyCreator() {
    $('#update_form').bind('submit', Mikrob.Events.updateSubmit);
  }
  function setUpTimeline(id) {
    this.viewport = new ViewPort(id);
    this.viewport.attachEventListener('click','input',Mikrob.Events.statusListener);
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
  return {
    setUpTimeline : setUpTimeline,
    setContents : setContents,
    setUpCharCounter : setUpCharCounter,
    setUpBodyCreator : setUpBodyCreator,
    viewport : viewport,
    enableForm : enableForm,
    disableForm : disableForm
  };
})();
