
$(document).ready(()=> {

  $.hideAll();

  checkUserQuery();

  attachButtonListeners();

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

      fireMailgun(res);

    }).catch(res=>{
      console.log('fail', res);
    });
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

});
