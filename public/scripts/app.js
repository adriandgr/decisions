
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
        console.log('RES', res);
        console.log('success', res.ids);
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
      console.log('hey');
      // call the same render function
      $('<p>').text('I need to call the render function here')
        .appendTo('#display-results-admin')
      $('#vote-view').fadeToggle('fast', () => {
        $('#no-results-admin').hide();
        $('#display-results-admin').show();
        $('#admin-view').fadeToggle('slow');
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
