

function renderAdminView(res) {
  //console.log('RES.poll.voter_uuid inside renderAdminView', res.poll.voter_uuid);
  console.log('RES at renderAdmin', res)
  let $list = $('<ul>').attr('id', res.poll.voter_uuid);
  let $question = $('<h2>').addClass('poll-question').text(res.poll.name);
  res.choices.forEach((a, b) => {
    console.log('a in forEach of renderAdminView',a)
    let $span = $('<span>').addClass('choice-rank').text(`${a.borda_count}`);
    let $li = $('<li>').data( {
      "choice-id": a.id,
      "rank": a.borda_count
    });
    $span.appendTo($li);

    let $choice = $('<p>')
      .addClass('list-choice')
      .text(a.name);
    let $description = $('<p>')
      .addClass('list-description')
      .text(a.description);

    $choice.appendTo($li);
    $description.appendTo($li);
    $li.appendTo($list);
  });

  $sortedList = $list.children('li');

  $sortedList.sort(function(a,b){
    let aRank = $(a).data('rank');
    let bRank = $(b).data('rank');
    if(aRank < bRank) {
      return 1;
    }
    if(aRank > bRank) {
      return -1;
    }
    return 0;
  });

  $sortedList.detach().appendTo($list);

  $list.prependTo('#display-results-admin');
  $question.prependTo('#display-results-admin');
  if( res.poll.voter_uuid === res.poll.admin_uuid ) {
  $('<button>')
    .addClass('btn-nofill btn-center view-btn')
    .attr('id', 'end-merge')
    .data('uuid', res.poll.admin_uuid)
    .text('END MERGE')
    .appendTo('#display-results-admin');
  }
  $('#no-results-admin').hide();
  $('#display-results-admin').show();
  $('#admin-view').fadeToggle('slow');

}

function renderVoteView(res){
  console.log('renderVoteView')
  let $list = $('<ul>').attr('id', res.poll.voter_uuid);
  let $question = $('<h2>').addClass('poll-question').text(res.poll.name);
  res.choices.forEach((a, b) => {

    let $span = $('<span>').addClass('drag-handle');
    $('<i>')
      .addClass('fa fa-bars')
      .attr('aria-hidden', 'true')
      .appendTo($span);
    let $li = $('<li>').data({
      "choice-id": a.id,
      "rank": a.borda_count
    });
    $span.appendTo($li);

    let $choice = $('<p>')
      .addClass('list-choice')
      .text(a.name);
    let $description = $('<p>')
      .addClass('list-description')
      .text(a.description);

    $choice.appendTo($li);
    $description.appendTo($li);
    $li.appendTo($list);
  });

  $list.prependTo('#display-results');
  $question.prependTo('#display-results');

  Sortable.create(byId(res.poll.voter_uuid), {
    handle: '.drag-handle',
    animation: 150
  });

  $('#no-results').hide();
  $('#display-results').show();
  $('#vote-view').fadeToggle('slow');
}


function genSortableList(data, res) {
let $list = $('<ul>').attr('id', res.adminUUID);
  let $question = $('<h2>').addClass('poll-question').text(data.name);
  res.ids.forEach((a, b) => {

    let $span = $('<span>').addClass('drag-handle');
    $('<i>')
      .addClass('fa fa-bars')
      .attr('aria-hidden', 'true')
      .appendTo($span);
    let $li = $('<li>').data( "choice-id", a.id );
    $span.appendTo($li);

    let $choice = $('<p>')
      .addClass('list-choice')
      .text(data.choices[b].name);
    let $description = $('<p>')
      .addClass('list-description')
      .text(data.choices[b].description);
    $choice.appendTo($li);
    $description.appendTo($li);
    $li.appendTo($list);
  });

  $list.prependTo('#display-results');
  $question.prependTo('#display-results');

  Sortable.create(byId(res.adminUUID), {
    handle: '.drag-handle',
    animation: 150
  });

  $('#send-view').fadeToggle('fast', () => {
    $('#no-results').hide();
    $('#display-results').show();
    $('#vote-view').fadeToggle('slow');
  });
}


function addInput(targetId, word) {
  let len = $(`${targetId} > div`).length;

  let $div = $("<div>")
    .addClass('form-group row')
    .attr('id', `node-${len - 2}`);

  let $label = $("<label>")
    .addClass('col-1')
    .attr( 'for', `${word}-${len - 2}`);

  $("<i>")
    .addClass('delete-choice fa fa-trash-o')
    .attr({ id: `x${len - 2}`, 'aria-hidden': 'true' })
    .appendTo( $label );

  $label.appendTo( $div );

  $("<input>")
    .addClass(`col-10 col-md-6 form-control op1 ${ word === 'choice' ? word : 'friend-email' }`)
    .attr({
      id: `${word}-${len - 2}`,
      type: 'text',
      placeholder: ordinalWord(len - 2, word)
    }).appendTo( $div );

  let $plusSpace = $('<div>')
    .addClass('col-1 offset-md-0 plus-space-sm');

  $('<i>')
    .addClass('fa fa-plus show-option')
    .attr('aria-hidden', 'true')
    .appendTo( $plusSpace );
  $plusSpace.appendTo( $div );

  $('<input>')
    .addClass(`hidden-sm-down col-md-4 form-control op2 ${ word === 'choice' ? 'description' : 'friend-name' }`)
    .attr({
      id: `${ word === 'choice' ? 'description' : 'friend-name' }-${len - 2}`,
      type: 'text',
      placeholder: `${ word === 'choice' ? 'optional description' : 'their name' }`
    }).appendTo( $div );

  $( $div ).insertAfter( `${targetId} > div:nth-child(${len - 2})` );
}
