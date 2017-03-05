

function renderAdminView(res) {
  console.log(res.poll.admin_uuid);
  let $list = $('<ul>').attr('id', res.poll.admin_uuid);
  let $question = $('<h2>').addClass('poll-question').text(res.poll.name);
  res.choices.forEach((a, b) => {
    console.log(a)
    let $span = $('<span>');
    $('<i>')
      .addClass('fa fa-bars')
      .attr('aria-hidden', 'true')
      .appendTo($span);
    let $li = $('<li>').data( "choice-id", a.id );
    $span.appendTo($li);

    let $choice = $('<p>')
      .addClass('list-choice')
      .text(a.name);
    let $description = $('<p>')
      .addClass('list-description')
      .text(`description... borda: ${a.borda_rank}`);

    $choice.appendTo($li);
    $description.appendTo($li);
    $li.appendTo($list);
  });

  $list.prependTo('#display-results-admin');
  $question.prependTo('#display-results-admin');

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
