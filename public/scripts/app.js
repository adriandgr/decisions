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

function ordinalWord(num, word) {
  switch (num) {
  case 1:
    return `enter first ${word}`;
  case 2:
    return `enter second ${word}`;
  case 3:
    return `enter third ${word}`;
  case 4:
    return `enter fourth ${word}`;
  case 5:
    return `enter fifth ${word}`;
  default:
    return `enter ${word} ${num}`;
  }
}

function addInput(targetId, word) {
  let len = $(`${targetId} > div`).length;

  let $div = $("<div>").addClass('form-group row').attr('id', `node-${len - 2}`);
  let $label = $("<label>").addClass('col-1').attr( 'for', `choice-${len - 2}`);
  $("<i>").addClass('delete-choice fa fa-times').attr('id', `x${len - 2}`).appendTo($label);
  $label.appendTo($div);
  $("<input>").addClass('col-11 form-control').attr({
    id: `choice-${len - 2}`,
    type: 'text',
    placeholder: ordinalWord(len - 2, word)
  }).appendTo($div);
  console.log('div to add', $div)
  $( $div ).insertAfter( `${targetId} > div:nth-child(${len - 2})` );
}


$(document).ready(()=> {


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

  $('#nav-control').on('click', ()=> {
    $('#main-nav').toggle();
  });

  $('#create-poll').on('click', ()=> {
    $('#home-view').toggle();
    $('#create-view').toggle();
  });

  $('#capture-emails').on('click', (event)=> {
    event.preventDefault();
    $('#create-view').toggle();
    $('#send-view').toggle();
  });


});
