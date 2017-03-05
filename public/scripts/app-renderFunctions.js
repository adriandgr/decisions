

let string = '{"name":"question","created_by":"me","creator_email":"my@emai","choices":[{"choice":"choice1","description":"option1"},{"choice":"choice2","description":"option2"},{"choice":"choice3","description":"option3"}],"send_to":[{"name":"friend","email":"friend@email"}]}'
let testData = JSON.parse(string);

    //  <li>
     //   <span class="drag-handle">
     //     <i class="fa fa-bars" aria-hidden="true"></i>
    //    </span>
  //      one
    //  </li>
//<ul id="foo">
//
function genSortableList(data, res) {
  console.log(res.ids[0]);
  let $list = $('<ul>').attr('id', res.adminUUID);



  data.choices.forEach((a, b) =>{
    let $span = $('<span>').addClass('drag-handle');
    $('<i>')
      .addClass('fa fa-bars')
      .attr('aria-hidden', 'true')
      .appendTo($span);
    let $li = $('<li>');
    $span.appendTo($li);

    let $choice = $('<p>')
      .addClass('list-choice')
      .text(a.choice);
    let $description = $('<p>')
      .addClass('list-description')
      .text(a.description);

    $choice.appendTo($li);
    $description.appendTo($li);
    $li.appendTo($list);

  });
  $list.prependTo('#display-results');
  //insertAfter( '#display-results' > div:nth-child(${len - 2})` )
}



//genSortableList(testData, 'uuid');


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
