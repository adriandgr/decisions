var byId = function (id) { return document.getElementById(id); },

    loadScripts = function (desc, callback) {
      var deps = [], key, idx = 0;

      for (key in desc) {
        deps.push(key);
      }

      (function _next() {
        var pid,
          name = deps[idx],
          script = document.createElement('script');

        script.type = 'text/javascript';
        script.src = desc[deps[idx]];

        pid = setInterval(function () {
          if (window[name]) {
            clearTimeout(pid);

            deps[idx++] = window[name];

            if (deps[idx]) {
              _next();
            } else {
              callback.apply(null, deps);
            }
          }
        }, 30);

        document.getElementsByTagName('head')[0].appendChild(script);
      })()
    },

    console = window.console;


  if (!console.log) {
    console.log = function () {
      alert([].join.apply(arguments, ' '));
    };
  }

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
  let colWidth, $plusSpace, $input2;
  if (word === 'choice') {
    colWidth = 11;
  } else {
    $plusSpace = $('<div>').addClass('col-1 plus-space-sm');
    $('<i>').addClass('fa fa-plus').attr('aria-hidden', 'true').appendTo($plusSpace);

    $input2 = $('<input>').addClass('col-4 form-control friend-name').attr({
      id: `friend-name-${len - 2}`,
      type: 'text',
      placeholder: 'their name'
    });
    colWidth = 6;
  }

  let $div = $("<div>").addClass('form-group row').attr('id', `node-${len - 2}`);
  let $label = $("<label>").addClass('col-1').attr( 'for', `${word}-${len - 2}`);
  $("<i>").addClass('delete-choice fa fa-times').attr({ id: `x${len - 2}`, 'aria-hidden': 'true' }).appendTo($label);
  $label.appendTo($div);
  $("<input>").addClass(`col-${colWidth} form-control ${ word === 'choice' ? word : 'friend-email' }`).attr({
    id: `${word}-${len - 2}`,
    type: 'text',
    placeholder: ordinalWord(len - 2, word)
  }).appendTo($div);
  if (word === 'friend'){
    $plusSpace.appendTo($div);
    $input2.appendTo($div);
  }

  $( $div ).insertAfter( `${targetId} > div:nth-child(${len - 2})` );
}

function composeObject(arr1, arr2, keys) {
  let sendObject = arr1.reduce((a, b, c) => {
    let obj = {};
    obj[keys[0]] = b;
    obj[keys[1]] = arr2[c];
    a.push(obj);
    return a;
  }, []);
  return sendObject;
}

// creator_vote: [
    //   {
    //     choice_name: name
    //     rank:
    //   },
    //   {
    //     choice_name: name
    //     rank:
    //   }
    // ]

function dataComposer() {
  let choices = [];
  for ( let choice of $('.choice')){
    choices.push(choice.value);
  }

  let friends = [];
  for ( let friend of $('.friend-name')){
    friends.push(friend.value);
  }

  let emails = [];
  for ( let email of $('.friend-email')){
    emails.push(email.value);
  }

  let data = {
    name: $('#poll-name')[0].value,
    created_by: $('#creator-name')[0].value,
    creator_email: $('#creator-email')[0].value,
    choices: choices,
    send_to: composeObject(friends, emails, ['name', 'email'])
  };
  return data;
}

function genSortableList(data) {
  console.log(data)
  data.choices.forEach((a,b) =>{
    console.log('a', a);
    console.log('b', b);
  });

  let $li = $('<li>')
  let $span = $('<i>').addClass('fa fa-bars').attr('aria-hidden', 'true')
    .appendTo($('<span>').addClass('drag-handle'))
    .appendTo($li).text('hoots');

}


$(document).ready(()=> {


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
    $('#home-view').fadeToggle('fast',()=>{
      $('#create-view').fadeToggle('slow');
    });

  });

  $('#capture-emails').on('click', (event)=> {
    event.preventDefault();
    $('#create-view').toggle();
    $('#send-view').toggle();
  });
  let data = dataComposer();
  genSortableList(data);
  $('#submit-form').on('click', (event)=> {
    event.preventDefault();
    console.log(dataComposer())
    $.ajax({
      type: 'POST',
      url: '/polls',
      data: data,
      dataType: 'json'
    }).then(res=> {
      console.log('success', res);
      Sortable.create(byId('foo'), {
        handle: '.drag-handle',
        animation: 150
      });
      genSortableList(data);
      $('#send-view').fadeToggle('fast',()=> {
        $('#no-results').hide();
        $('#display-results').show();
        $('#results-view').fadeToggle('slow');
      });
    }).catch(res=>{
      console.log('fail', res);
    });

    // $.ajax({
    //     type: 'DELETE',
    //     url: '/users/session'
    // }).then((res) => {
    // });


  });


  let isDragging = false;

  $('#display-results li > .drag-handle').mousedown(function() {
    isDragging = false;
  })
  .mousemove(function() {
      isDragging = true;
   })
  .mouseup(function() {
      var wasDragging = isDragging;
      isDragging = false;
      if (!wasDragging) {
        console.log('did not drag!')
          $("#throbble").toggle();
      } else {
        console.log('you\'re such a drag!')
      }
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



});
