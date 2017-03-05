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
