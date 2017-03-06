
$(document).ready( () => {

  if($.getQueryKeys() ? $.getQueryKey('key') : false ){
    console.log('GET /polls/' + $.getQueryKey('key'));
    $.ajax({
      type: 'GET',
      url: `/polls/${$.getQueryKey('key')}`,
      headers: {
        "X-Source": "merge_app"
      }
    }).then(res => {

      renderAdminView(res);

      $('#no-results-admin').hide();
      $('#display-results-admin').show();

      $('#admin-view').fadeToggle('slow');
    }).catch(res => {
      console.log('fail', res);
    });
  } else {
    $('#home-view').fadeToggle('slow');
  }

  $('.add-choice-btn').on('click', event => {
    event.preventDefault();
    addInput('#create-form', 'choice');

    window.Parsley.on('field:error', function() {
  // This global callback will be called for any field that fails validation.
  console.log('Validation failed for: ', this.$element);
});

    //  Ensure new choice is outfitted w/ parsley attributes
    $('#create-form').parsley().destroy();
    $('.choice:last').attr('data-parsley-group', 'choices');
    $('.choice:last').attr('data-parsley-required', 'true');
    $('#create-form').parsley();

    $('.choice:last').focus();
  });

  $('.add-friend-btn').on('click', event => {
    event.preventDefault();
    addInput('#send-form', 'friend');

    $('#send-form').parsley().destroy();
    $('.friend-email:last').attr('data-parsley-group', 'emails');
    $('.friend-email:last').attr('data-parsley-required', 'true');
    $('#send-form').parsley();

    $('#send-form').parsley().destroy();
    $('.friend-name:last').attr('data-parsley-group', 'emails');
    $('.friend-name:last').attr('data-parsley-required', 'true');
    $('#send-form').parsley();

    $('.friend-email:last').focus();
  });

  $(document).on('click', '.delete-choice', event => {
    event.preventDefault();
    let len = $('#create-form > div').length;
    if (len < 4) {
      return;
    }
    $(event.target).closest('div').remove();
  });

  $(document).on('click', '.show-option', event => {
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


  $('#create-poll').on('click', () => {
    $('#home-view').fadeToggle('fast', () =>{
      $('#create-view').fadeToggle('slow');
    });
  });

  $('#capture-emails').on('click', event => {
    event.preventDefault();

    // Take user to next page if first page of form is valid
    if($('#create-form').parsley().validate({ group: 'choices' })) {
      $('#create-view').fadeToggle('fast', () => {
        $('#send-view').fadeToggle('slow');
      });
    } else {
      $('#create-form').parsley().validate({ group: 'choices' });
    }

  });

  // MAIN SUBMIT EVENT
  $('#submit-form').on('click', event => {
    event.preventDefault();

    if($('#send-form').parsley().isValid( { group: 'emails' })) {
      data = dataComposer();
      console.log(JSON.stringify(data));
      $.ajax({
        type: 'POST',
        url: '/polls',
        data: data,
        dataType: 'json'
      }).then(res=> {
        console.log('success', res.ids);
        genSortableList(data, res);
        Sortable.create(byId(res.adminUUID), {
          handle: '.drag-handle',
          animation: 150
        });

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
    } else {
      $('#send-form').parsley().validate({ group: 'emails' });
    }


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
      $('#results-view').fadeToggle('fast', ()=> {
        $('#admin-view').fadeToggle('slow');
      });
    }).catch(res=>{
      console.log('fail', res);
    });

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

  /*
      Catches any validation errors and changes border colour of input
   */
  window.Parsley.on('field:error', function() {
    this.$element.css('border', 'solid tomato 4px');
  });

  window.Parsley.on('field:success', function() {
    this.$element.css('border', 'solid #7dafd8 4px');
    console.log('works');
    // this.$element.css('border', 'solid white 4px');
  });



});
