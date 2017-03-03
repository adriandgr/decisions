let choiceInput = 0;

function neverCalled() {
  $("p").addClass('col-md-6').text("blaha").appendTo("#main");
  $("#main").append("<p> class='col</p>"); // do not do this

  //alternate
  let p = $("p").addClass('col-md-6');
  if (true) {
    p.text("blaha").appendTo("#main");
  }

}

function ordinalWord(num) {
  switch (num) {
  case 1:
    return 'enter first choice';
  case 2:
    return 'enter second choice';
  case 3:
    return 'enter third choice';
  case 4:
    return 'enter fourth choice';
  case 5:
    return 'enter fifth choice';
  default:
    return `enter choice ${num}`;
  }
}

function addChoiceInput() {
  let len = $('#create-form > div').length;

  let $div = $("<div>").addClass('form-group row').attr('id', `node-${len - 2}`);
  let $label = $("<label>").addClass('col-1').attr( 'for', `choice-${len - 2}`);
  $("<i>").addClass('delete-choice fa fa-times').appendTo($label);
  $label.appendTo($div);
  $("<input>").addClass('col-11 form-control').attr({
    id: `choice-${len - 2}`,
    type: 'text',
    placeholder: ordinalWord(len - 2)
  }).appendTo($div);
  console.log('label', $label);
  console.log('div', $div);
  $( $div ).insertAfter( `#create-form > div:nth-child(${len - 2})` );
}

function removeLastChoice() {
  console.log('clicked!')
}

$(document).ready(()=> {

  $('.add-choice-btn').on('click', (event)=> {
    event.preventDefault();
    addChoiceInput();
  });
  $('.delete-choice').on('click', (event)=> {
    event.preventDefault();
    removeLastChoice();
  });

  $('#nav-control').on('click', ()=> {
    $('#main-nav').toggle();
  });

  $('#create-poll').on('click', ()=> {
    $('#home-view').toggle();
    $('#create-view').toggle();
  });


});
