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



let string = '{"name":"question","created_by":"me","creator_email":"my@emai","choices":[{"choice":"choice1","description":"option1"},{"choice":"choice2","description":"option2"},{"choice":"choice3","description":"option3"}],"send_to":[{"name":"friend","email":"friend@email"}]}'
let testData = JSON.parse(string);

function genSortableList(data, uuid) {
  let $list = $('ul').attr('id', uuid);
  console.log(data)
  data.choices.forEach((a,b) =>{


    console.log('a', a); //the object
    console.log('b', b); //the index
  });

  let $li = $('<li>')
  let $span = $('<i>').addClass('fa fa-bars').attr('aria-hidden', 'true')
    .appendTo($('<span>').addClass('drag-handle'))
    .appendTo($li).text('hoots');

}

genSortableList(testData);


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

  $(document).on('click', '.show-option', (event)=> {
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

  $('#create-poll').on('click', ()=> {
    $('#home-view').fadeToggle('fast',()=>{
      $('#create-view').fadeToggle('slow');
    });

  });

  $('#capture-emails').on('click', (event)=> {
    event.preventDefault();
    $('#create-view').fadeToggle('fast',()=>{
      $('#send-view').fadeToggle('slow');
    });
  });

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
