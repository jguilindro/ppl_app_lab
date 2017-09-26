$(document).ready(function(){
  $('#navbar').load('/partials/navbar.html', function(){
     inicializarMaterialize();
  });
});

function inicializarMaterialize(){
  $(".button-collapse").sideNav();
  $(".dropdown-button").dropdown();
}