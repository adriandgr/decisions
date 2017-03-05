


$(document).ready(()=> {

  $('.add-choice-btn').on('click', (event)=> {
    event.preventDefault();
    addInput('#create-form', 'choice');
  });

  $('.add-friend-btn').on('click', (event)=> {
    event.preventDefault();
    addInput('#send-form', 'friend');
  });

  $(document).on('click', '.delete-choice', (event)=> {
    event.preventDefault();
    let len = $('#create-form > div').length;
    if (len < 4) {
      return;
    }
    $(event.target).closest('div').remove();
  });

  $(document).on('click', '.show-option', (event)=> {
    event.preventDefault();
    $(event.target)
      .toggleClass('fa-plus fa-minus');
    $(event.target)
      .closest('div').toggleClass('offset-1');
    $(event.target)
      .closest('div').siblings('.op1')
      .toggleClass('col-10 col-11');
    $(event.target)
      .closest('div').siblings('.op2')
      .toggleClass('hidden-sm-down col-10');
  });

  $('#nav-control').on('click', ()=> {
    $('#main-nav').toggle();
  });

  $('#create-poll').on('click', ()=> {
    $('#home-view').fadeToggle('fast',()=>{
      $('#create-view').fadeToggle('slow');
    });

  });

  $('#capture-emails').on('click', (event)=> {
    event.preventDefault();
    $('#create-view').fadeToggle('fast',()=>{
      $('#send-view').fadeToggle('slow');
    });
  });

  // MAIN SUBMIT EVENT
  $('#submit-form').on('click', (event)=> {

    event.preventDefault();
    data = dataComposer();
    console.log(JSON.stringify(data));
    $.ajax({
      type: 'POST',
      url: '/polls',
      data: data,
      dataType: 'json'
    }).then(res=> {
      console.log('success', res);
      genSortableList(data, 'uuid');
      Sortable.create(byId('uuid'), {
        handle: '.drag-handle',
        animation: 150
      });

      $('#send-view').fadeToggle('fast',()=> {
        $('#no-results').hide();
        $('#display-results').show();
        $('#results-view').fadeToggle('slow');
      });
    }).catch(res=>{
      console.log('fail', res);
    });

    // $.ajax({
    //     type: 'DELETE',
    //     url: '/users/session'
    // }).then((res) => {
    // });


  });



  // helper menu
  $('#toggle-home-view').on('click', () => {
    $('#create-view').hide();
    $('#send-view').hide();
    $('#results-view').hide();
    $('#home-view').show();
    $('#main-nav').fadeToggle();

  });

  $('#toggle-create-view').on('click', () => {
    $('#create-view').toggle();
    $('#send-view').hide();
    $('#results-view').hide();
    $('#home-view').hide();
    $('#main-nav').hide();
  });

  $('#toggle-send-view').on('click', () => {
    $('#send-view').toggle();
    $('#home-view').hide();
    $('#create-view').hide();
    $('#results-view').hide();
    $('#main-nav').hide();
  });

  $('#toggle-results-view').on('click', () => {
    $('#results-view').toggle();
    $('#home-view').hide();
    $('#create-view').hide();
    $('#send-view').hide();
    $('#main-nav').hide();
  });

  $('#close-menu').on('click', () => {
    $('#main-nav').hide();
  });



});
