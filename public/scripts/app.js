
$(document).ready(()=> {

  if($.getQueryKeys() ? $.getQueryKey('key') : false ){
    // if querystring has assertion level 1, check if user is admin
    if($.getQueryKey('assert') === '1' ) {
      $.ajax({
        type: 'GET',
        url: `/admins/${$.getQueryKey('key')}`
      }).then(res=> {
        if (res.poll.voter_uuid !== res.poll.admin_uuid){
          return $('#admin-view').fadeToggle('slow');
        }
        if(!res.choices[0].rank){
          return renderVoteView(res);
        }
        renderAdminView(res);
      }).catch(res=>{
        console.log('fail', res);
      });
    } else if ($.getQueryKey('view') === 'sv') {
      $.ajax({
        type: 'GET',
        url: `/polls/${$.getQueryKey('key')}`
      }).then(res=> {
        renderVoteView(res);
      }).catch(res=>{
        console.log('fail', res);
      });
    }

  } else {
    $('#home-view').fadeToggle('slow');
  }

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
      console.log('RES', res);
      console.log('success', res.ids);
      genSortableList(data, res);

      // handles mailgun request on poll creation
      $.ajax({
        type: 'POST',
        url: '/mg',
        data: { 'create': true, admin_uuid: res.adminUUID },
        dataType: 'json'
      }).then(res => {
        console.log('Mailgun response', res);
      }).catch(err => {
        console.error('Error sending mmail for poll creation', err);
      });

      $('#send-view').fadeToggle('fast', ()=> {
        $('#no-results').hide();
        $('#display-results').show();
        $('#results-view').fadeToggle('slow');
      });
    }).catch(res=>{
      console.log('fail', res);
    });

    // $.ajax({
    //   type: 'DELETE',
    //   url: '/users/session'
    // }).then((res) => {
    //   console.log('res', res);
    // });

  });

  $('#submit-vote').on('click', event => {
    event.preventDefault();
    let id = $('#display-results > ul').attr('id');
    let len = $('#display-results ul > li').length;
    let data = [];
    console.log(len);

    for (let i = 1; i <= len; i++ ) {
      let vote = {
        voter_id: id,
        choice_id: $( `#display-results ul > li:nth-child(${i})` ).data('choiceId'),
        rank: len - (i - 1)
      };
      data.push(vote);
    }
    console.log(data);
    $.ajax({
      type: 'POST',
      url: `/polls/${id}`,
      data: {
        ballot: data,
        mssg: 'democracy rules...'
       },
      dataType: 'json'
    }).then(res=> {
      console.log('hey');
      $('#vote-view').fadeToggle('fast', ()=> {
        $('#no-results-admin').hide();
        $('#display-results-admin').show();
        $('#admin-view').fadeToggle('slow');
      });
    }).catch(res=>{
      console.log('fail', res);
    });

  });

  $(document).on('click','#end-merge', event => {
    const id = $(event.target).data('uuid');
    $.ajax({
      type: 'POST',
      url: `/admins/${id}`,
      data: {
        method: 'end'
      },
      dataType: 'json'
    }).then( res => {
      console.log(res);
    }).catch( res => {
      console.log(res);
    })
  });


  // helper menu
  $('#toggle-home-view').on('click', () => {
    $('#create-view').hide();
    $('#send-view').hide();
    $('#vote-view').hide();
    $('#home-view').show();
    $('#main-nav').fadeToggle();

  });

  $('#toggle-create-view').on('click', () => {
    $('#create-view').toggle();
    $('#send-view').hide();
    $('#vote-view').hide();
    $('#home-view').hide();
    $('#main-nav').hide();
  });

  $('#toggle-send-view').on('click', () => {
    $('#send-view').toggle();
    $('#home-view').hide();
    $('#create-view').hide();
    $('#vote-view').hide();
    $('#main-nav').hide();
  });

  $('#toggle-vote-view').on('click', () => {
    $('#vote-view').toggle();
    $('#home-view').hide();
    $('#create-view').hide();
    $('#send-view').hide();
    $('#main-nav').hide();
  });

  $('#close-menu').on('click', () => {
    $('#main-nav').hide();
  });



});
