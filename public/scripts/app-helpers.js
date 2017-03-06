var byId = function (id) { return document.getElementById(id); },

  loadScripts = function (desc, callback) {
    let deps = [];
    let key;
    let idx = 0;

    for (let key in desc) {
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
    })();
  },

  console = window.console;

if (!console.log) {
  console.log = function () {
    alert([].join.apply(arguments, ' '));
  };
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

function checkUserQuery(){
  if($.getQueryKeys() ? $.getQueryKey('key') : false ){
    // if querystring has assertion level 1, check if user is admin
    if($.getQueryKey('assert') === '1' ) {
      $.ajax({
        type: 'GET',
        url: `/admins/${$.getQueryKey('key')}`
      }).then(res=> {
        if (res.poll.voter_uuid !== res.poll.admin_uuid){
          return $('#admin-view').fadeToggle('slow');
        }
        if(!res.choices[0].rank){
          return renderVoteView(res);
        }
        renderAdminView(res);
      }).catch(res=>{
        console.log('fail', res);
      });
    } else if ($.getQueryKey('view') === 'sv') {
      $.ajax({
        type: 'GET',
        url: `/polls/${$.getQueryKey('key')}`
      }).then(res=> {
        renderVoteView(res);
      }).catch(res=>{
        console.log('fail', res);
      });
    }

  } else {
    $('#home-view').fadeToggle('slow');
  }

  $('.add-choice-btn').on('click', (event)=> {
    event.preventDefault();
    addInput('#create-form', 'choice');
    //  Ensure new choice is outfitted w/ parsley attributes
    $('#create-form').parsley().destroy();
    $('.choice:last').attr('data-parsley-group', 'choices');
    $('.choice:last').attr('data-parsley-required', 'true');
    $('#create-form').parsley();

    $('.choice:last').focus();
  });

  $('.add-friend-btn').on('click', (event)=> {
    event.preventDefault();
    addInput('#send-form', 'friend');
    $('#send-form').parsley().destroy();
    $('.friend-email:last').attr('data-parsley-group', 'emails');
    $('.friend-email:last').attr('data-parsley-required', 'true');
    $('#send-form').parsley();


    $('.friend-email:last').focus();
  });
}

function fireMailgun(res) {
  $.ajax({
    type: 'POST',
    url: '/mg',
    data: { 'method': 'create', admin_uuid: res.adminUUID },
    dataType: 'json'
  }).then(res => {
    console.log('Mailgun response', res);
  }).catch(err => {
    console.error('Error sending mmail for poll creation', err);
  });
}

function attachButtonListeners() {
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

  $('#nav-control').on('click', () => {
    $('#main-nav').toggle();
  });

  $('#create-poll').on('click', () => {
    $('#home-view').fadeToggle('fast', () => {
      $('#create-view').fadeToggle('slow');
    });
  });

  $('#capture-emails').on('click', event => {
    event.preventDefault();
    // Take user to next page if first page of form is valid
    if($('#create-form').parsley().validate({ group: 'choices' })) {
      $('#create-view').fadeToggle('fast', () => {
        $('#send-view').fadeToggle('slow');
      });
    } else {
      $('#create-form').parsley().validate({ group: 'choices' });
    }
  });


  // helper menu
  $('#toggle-home-view').on('click', () => {
    $('#create-view').hide();
    $('#send-view').hide();
    $('#vote-view').hide();
    $('#home-view').show();
    $('#main-nav').fadeToggle();

  });

  $('#toggle-create-view').on('click', () => {
    $('#create-view').toggle();
    $('#send-view').hide();
    $('#vote-view').hide();
    $('#home-view').hide();
    $('#main-nav').hide();
  });

  $('#toggle-send-view').on('click', () => {
    $('#send-view').toggle();
    $('#home-view').hide();
    $('#create-view').hide();
    $('#vote-view').hide();
    $('#main-nav').hide();
  });

  $('#toggle-vote-view').on('click', () => {
    $('#vote-view').toggle();
    $('#home-view').hide();
    $('#create-view').hide();
    $('#send-view').hide();
    $('#main-nav').hide();
  });

  $('#close-menu').on('click', () => {
    $('#main-nav').hide();
  });

}

$.extend({
  getQueryKeys: function(){
    const vars = [];
    let hash;
    let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    if (hashes[0] === window.location.href) {
      return;
    }
    for(let i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  getQueryKey: function(name){
    return $.getQueryKeys()[name];
  },
  hideAll: function(){
    $('section').hide();
  }
});
