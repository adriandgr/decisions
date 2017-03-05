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


$.extend({
  getQueryKeys: function(){
    const vars = [];
    let hash;
    let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    if(hashes[0] === window.location.href) {
      return;
    }
    for(let i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  getQueryKey: function(name){
    return $.getQueryKeys()[name];
  }
});
