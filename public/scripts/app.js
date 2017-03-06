
$(document).ready( () => {


  //$.hideAll();

  checkUserQuery();

  attachButtonListeners();


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
        console.log('DATA from SUBMIT-FORM', data);
        $('body').data('uuid', res.adminUUID);
        let stateObj = { foo: `?key=${res.adminUUID}&assert=1` };
        history.pushState(stateObj, "New Poll", `?key=${res.adminUUID}&assert=1`);
        genSortableList(data, res);

        fireMailgun(res);

      }).catch(res=>{
        console.log('fail', res);
      });
    } else {
      $('#send-form').parsley().validate({ group: 'emails' });
    }
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
      $.ajax({
      type: 'GET',
      url: `/admins/${$.getQueryKey('key')}`
    }).then( res => {
      console.log('hey');
      console.log('RES at INNER AJAX', res)
      // call the same render function
      renderAdminView(res);
      $('#no-results-admin').hide();
      $('#display-results-admin').show();

      $('#vote-view').fadeToggle('fast', ()=>{
        $('#admin-view').fadeIn();
      });

    });


    }).catch(res=>{
      console.log('fail', res);
    });
  });


  $(document).on('click', '#end-merge', event => {
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
      $.ajax({
        type: 'POST',
        url: '/mg/',
        data: {
          method: 'end',
          admin_uuid: id
        },
        dataType: 'json'
      }).then( res => {
        console.log(res);
      })

    }).catch( res => {
      console.log(res);
    });
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
