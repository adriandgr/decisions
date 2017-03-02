

$(document).ready(()=> {

  $('#nav-control').on('click', ()=> {
    $('#main-nav').toggle();
  });

  $('#create-poll').on('click', ()=> {
    $('#home-view').toggle();
    $('#create-view').toggle();
  });


});
